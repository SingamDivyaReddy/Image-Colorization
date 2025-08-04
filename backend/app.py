import os
import uuid
from flask import Flask, request, jsonify, url_for # Removed render_template, redirect, flash
from flask_cors import CORS # Import CORS
from werkzeug.utils import secure_filename
# import cv2 # Only if not handled entirely by common_utils/PIL for basic loading
import numpy as np
from PIL import Image
import bcrypt # Added for password hashing

# Import relevant functions from common_utils
from common_utils import (
    resize_image, load_model as cu_load_model, colorizer as cu_colorizer,
    color_correction as cu_color_correction, enhance_details as cu_enhance_details,
    adjust_intensity as cu_adjust_intensity,
    adjust_hue_saturation as cu_adjust_hue_saturation
)
# from enhancements import apply_style_transfer # Uncomment if you use this

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
app.secret_key = "your_image_colorizer_secret_key" # Change this!

# --- Configuration ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'static', 'outputs')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MODEL_DIR'] = MODEL_DIR
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB max image upload size

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# --- Model Paths ---
PROTOTXT_STD = os.path.join(app.config['MODEL_DIR'], "models_colorization_deploy_v2.prototxt")
MODEL_STD = os.path.join(app.config['MODEL_DIR'], "colorization_release_v2.caffemodel")
MODEL_ARTISTIC = os.path.join(app.config['MODEL_DIR'], "colorization_release_v2_norebal.caffemodel")
POINTS_STD = os.path.join(app.config['MODEL_DIR'], "pts_in_hull.npy")

# In-memory user store (for demonstration purposes)
# In a real application, use a database!
users_db = []

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/')
def home():
    return "Welcome to the backend!"

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing username, email, or password"}), 400

    username = data['username']
    email = data['email']
    password = data['password']

    # Check if user already exists
    if any(user['username'] == username for user in users_db):
        return jsonify({"error": "Username already exists"}), 409 # 409 Conflict
    if any(user['email'] == email for user in users_db):
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    new_user = {
        "id": str(uuid.uuid4()), 
        "username": username,
        "email": email,
        "password_hash": hashed_password.decode('utf-8') # Store hash as string
    }
    users_db.append(new_user)
    print(f"User created: {new_user['username']}") # For server log
    return jsonify({"message": "User created successfully!", "user_id": new_user["id"]}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400

    username = data['username']
    password = data['password']

    user = next((user for user in users_db if user['username'] == username), None)

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        # In a real app, create a session or JWT token here
        print(f"User logged in: {user['username']}") # For server log
        return jsonify({"message": "Login successful!", "user_id": user["id"]}), 200 # Consider returning a token
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/image-colorizer', methods=['POST']) # Changed route, methods only POST
def image_colorizer_api():
    if 'image_file' not in request.files:
        return jsonify({'error': 'No image file part'}), 400
    file = request.files['image_file']
    if file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())[:8]
        original_filename_on_server = f"original_{unique_id}_{filename}"
        original_filepath = os.path.join(app.config['OUTPUT_FOLDER'], original_filename_on_server)
        
        colorized_filename_on_server = f"colorized_{unique_id}_{filename}"
        colorized_filepath = os.path.join(app.config['OUTPUT_FOLDER'], colorized_filename_on_server)
        
        file.save(original_filepath)

        try:
            model_choice_form = request.form.get('model_choice', 'standard')
            detail_enhancement = float(request.form.get('detail_enhancement', 0.25))
            intensity = float(request.form.get('intensity', 1.0))
            hue_shift = int(request.form.get('hue_shift', 0))
            saturation_scale = float(request.form.get('saturation_scale', 1.0))
            auto_color_correct = request.form.get('auto_color_correct') == 'true' # From JS 'true'/'false'

            pil_image = Image.open(original_filepath).convert("RGB")
            img_np_rgb = np.array(pil_image)
            img_np_resized_rgb = img_np_rgb # Using original size

            prototxt = PROTOTXT_STD
            points = POINTS_STD
            model_file_path = MODEL_STD
            if model_choice_form == "artistic":
                if os.path.exists(MODEL_ARTISTIC):
                    model_file_path = MODEL_ARTISTIC
                # else: # Optionally inform client, but simpler to default
                    # return jsonify({'warning': "Artistic model not found, using Standard."}), 200 
            
            net, error_msg = cu_load_model(prototxt, model_file_path, points)
            if not net:
                if os.path.exists(original_filepath): os.remove(original_filepath)
                return jsonify({'error': f"Error loading model: {error_msg}"}), 500

            colorized_img_rgb = cu_colorizer(img_np_resized_rgb, net)

            if auto_color_correct:
                colorized_img_rgb = cu_color_correction(colorized_img_rgb)
            if detail_enhancement > 0:
                colorized_img_rgb = cu_enhance_details(colorized_img_rgb, detail_enhancement)
            if intensity != 1.0:
                colorized_img_rgb = cu_adjust_intensity(colorized_img_rgb, intensity)
            if hue_shift != 0 or saturation_scale != 1.0:
                colorized_img_rgb = cu_adjust_hue_saturation(colorized_img_rgb, hue_shift, saturation_scale)
            
            colorized_pil = Image.fromarray(colorized_img_rgb)
            colorized_pil.save(colorized_filepath)

            # Return full URLs for the client
            base_url = request.host_url.rstrip('/') # e.g., http://127.0.0.1:5000
            original_image_url = f"{base_url}{url_for('static', filename=f'outputs/{original_filename_on_server}')}"
            colorized_image_url = f"{base_url}{url_for('static', filename=f'outputs/{colorized_filename_on_server}')}"
            
            return jsonify({
                'message': 'Image colorized successfully!',
                'originalImageUrl': original_image_url,
                'colorizedImageUrl': colorized_image_url
            }), 200

        except Exception as e:
            import traceback
            print(f"ERROR during image processing: {traceback.format_exc()}")
            if os.path.exists(original_filepath): os.remove(original_filepath)
            if os.path.exists(colorized_filepath): os.remove(colorized_filepath)
            return jsonify({'error': f'An error occurred during image processing: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Invalid image file type. Allowed types are png, jpg, jpeg.'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)