# common_utils.py
import numpy as np
import cv2
import os
from PIL import Image

def resize_image(img_np, max_dim=512):
    """ Resizes a NumPy image array """
    height, width = img_np.shape[:2]
    if max(height, width) > max_dim:
        scaling_factor = max_dim / max(height, width)
        new_width = int(width * scaling_factor)
        new_height = int(height * scaling_factor)
        if new_width > 0 and new_height > 0 :
             img_np = cv2.resize(img_np, (new_width, new_height))
        else:
            print(f"Warning: Invalid resize dimensions ({new_width}, {new_height}) for image of shape {img_np.shape}. Skipping resize.")
    return img_np

def load_model(prototxt_path, model_path, points_path):
    """ Loads the Caffe model. Returns (net, error_message_or_None). """
    if not os.path.exists(prototxt_path):
        error_msg = f"Prototxt file not found: {prototxt_path}"
        print(f"ERROR: {error_msg}")
        return None, error_msg
    if not os.path.exists(model_path):
        error_msg = f"Caffe model file not found: {model_path}"
        print(f"ERROR: {error_msg}")
        return None, error_msg
    if not os.path.exists(points_path):
        error_msg = f"Points file not found: {points_path}"
        print(f"ERROR: {error_msg}")
        return None, error_msg

    try:
        net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)
        pts = np.load(points_path)
        class8 = net.getLayerId("class8_ab")
        conv8 = net.getLayerId("conv8_313_rh")
        pts = pts.transpose().reshape(2, 313, 1, 1)
        net.getLayer(class8).blobs = [pts.astype(np.float32)]
        net.getLayer(conv8).blobs = [np.full([1, 313], 2.606, dtype=np.float32)]
        return net, None
    except cv2.error as e:
        error_msg = f"OpenCV error loading model: {e}. Prototxt: {prototxt_path}, Model: {model_path}"
        print(f"ERROR: {error_msg}")
        return None, error_msg
    except Exception as e:
        error_msg = f"General error loading model: {e}"
        print(f"ERROR: {error_msg}")
        return None, error_msg

def colorizer(img_rgb_np, net, upsample_method=cv2.INTER_CUBIC):
    """
    Colorizes an RGB NumPy image array.
    Returns a colorized NumPy array in RGB format.
    """
    if len(img_rgb_np.shape) != 3 or img_rgb_np.shape[2] != 3:
        print(f"ERROR: Colorizer expects a 3-channel RGB image, got shape {img_rgb_np.shape}")
        return img_rgb_np # Return original or raise error

    orig_h, orig_w = img_rgb_np.shape[:2]
    scaled = img_rgb_np.astype(np.float32) / 255.0
    lab = cv2.cvtColor(scaled, cv2.COLOR_RGB2LAB)
    original_L = cv2.split(lab)[0].copy()
    resized_for_net = cv2.resize(lab, (224, 224))
    L_for_network = cv2.split(resized_for_net)[0]
    L_for_network -= 50
    net.setInput(cv2.dnn.blobFromImage(L_for_network))
    ab = net.forward()[0, :, :, :].transpose((1, 2, 0))
    ab_upsampled = cv2.resize(ab, (orig_w, orig_h), interpolation=upsample_method)
    colorized_lab = np.concatenate((original_L[:, :, np.newaxis], ab_upsampled), axis=2)
    colorized_rgb_float = cv2.cvtColor(colorized_lab, cv2.COLOR_LAB2RGB)
    colorized_rgb_float = np.clip(colorized_rgb_float, 0, 1)
    colorized_rgb_uint8 = (255 * colorized_rgb_float).astype(np.uint8)
    return colorized_rgb_uint8

def color_correction(image_rgb_np, reference_rgb_np=None):
    """ Performs color correction on an RGB NumPy image. """
    if len(image_rgb_np.shape) != 3 or image_rgb_np.shape[2] != 3:
        print("Color correction: Input image is not a 3-channel RGB image.")
        return image_rgb_np

    if reference_rgb_np is not None:
        if len(reference_rgb_np.shape) != 3 or reference_rgb_np.shape[2] != 3:
            print("Color correction: Reference image is not a 3-channel RGB image. Using auto-correction.")
            reference_rgb_np = None
        else:
            try:
                reference_resized_np = cv2.resize(reference_rgb_np, (image_rgb_np.shape[1], image_rgb_np.shape[0]))
                src_lab = cv2.cvtColor(reference_resized_np, cv2.COLOR_RGB2LAB)
                dst_lab = cv2.cvtColor(image_rgb_np, cv2.COLOR_RGB2LAB)
                src_mean, src_std = cv2.meanStdDev(src_lab)
                dst_mean, dst_std = cv2.meanStdDev(dst_lab)
                l_dst, a_dst, b_dst = cv2.split(dst_lab.astype(np.float32))
                std_a_dst = dst_std[1][0] if dst_std[1][0] != 0 else 1.0
                std_b_dst = dst_std[2][0] if dst_std[2][0] != 0 else 1.0
                a_corrected = ((a_dst - dst_mean[1][0]) * (src_std[1][0] / std_a_dst)) + src_mean[1][0]
                b_corrected = ((b_dst - dst_mean[2][0]) * (src_std[2][0] / std_b_dst)) + src_mean[2][0]
                corrected_lab = cv2.merge([l_dst, a_corrected, b_corrected])
                corrected_lab = np.clip(corrected_lab, 0, 255).astype(np.uint8)
                corrected_rgb = cv2.cvtColor(corrected_lab, cv2.COLOR_LAB2RGB)
                return corrected_rgb
            except Exception as e:
                print(f"Color correction with reference failed: {e}. Using auto-correction instead.")

    hsv = cv2.cvtColor(image_rgb_np, cv2.COLOR_RGB2HSV)
    h, s, v = cv2.split(hsv)
    yellow_green_mask = ((h >= 20) & (h <= 75))
    h[yellow_green_mask] = np.clip(h[yellow_green_mask] - 5, 0, 179)
    s_float = s.astype(np.float32)
    s_float[yellow_green_mask] = s_float[yellow_green_mask] * 0.90
    s = np.clip(s_float, 0, 255).astype(np.uint8)
    corrected_hsv = cv2.merge([h, s, v])
    corrected_rgb = cv2.cvtColor(corrected_hsv, cv2.COLOR_HSV2RGB)
    return corrected_rgb

def enhance_details(image_rgb_np, amount=1.0):
    """ Enhances details in an RGB NumPy image. """
    if len(image_rgb_np.shape) != 3 or image_rgb_np.shape[2] != 3:
        print("Enhance details: Input image is not a 3-channel RGB image.")
        return image_rgb_np

    lab = cv2.cvtColor(image_rgb_np, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    amount = max(0.0, min(1.0, amount))
    blur_radius = 2.0 + amount * 3.0
    gaussian = cv2.GaussianBlur(l, (0,0), sigmaX=blur_radius, sigmaY=blur_radius)
    l_weight = 1.0 + (amount * 0.5)
    g_weight = -(amount * 0.5)
    unsharp_mask = cv2.addWeighted(l, l_weight, gaussian, g_weight, 0)
    unsharp_mask = np.clip(unsharp_mask, 0, 255).astype(np.uint8)
    enhanced_lab = cv2.merge([unsharp_mask, a, b])
    enhanced_rgb = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)
    return enhanced_rgb

def adjust_intensity(image_rgb_np, intensity=1.0):
    """ Adjusts color intensity of an RGB NumPy image. """
    if len(image_rgb_np.shape) != 3 or image_rgb_np.shape[2] != 3:
        print("Adjust intensity: Input image is not a 3-channel RGB image.")
        return image_rgb_np
    return np.clip(image_rgb_np.astype(np.float32) * intensity, 0, 255).astype(np.uint8)

def adjust_hue_saturation(image_rgb_np, hue_shift=0, saturation_scale=1.0):
    """ Adjusts hue and saturation of an RGB NumPy image. """
    if len(image_rgb_np.shape) != 3 or image_rgb_np.shape[2] != 3:
        print("Adjust hue/saturation: Input image is not a 3-channel RGB image.")
        return image_rgb_np
    hsv = cv2.cvtColor(image_rgb_np, cv2.COLOR_RGB2HSV).astype(np.float32)
    hsv[..., 0] = (hsv[..., 0] + hue_shift) % 180
    hsv[..., 1] = np.clip(hsv[..., 1] * saturation_scale, 0, 255)
    hsv = hsv.astype(np.uint8)
    hsv[..., 0] = np.clip(hsv[..., 0], 0, 179)
    hsv[..., 1] = np.clip(hsv[..., 1], 0, 255)
    hsv[..., 2] = np.clip(hsv[..., 2], 0, 255)
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

# Optional: If you have a super-resolution function for images in common_utils.py,
# you can keep it. If it was only for video, remove it.
# def try_super_resolution(image_rgb_np): ...