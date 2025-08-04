import axios from 'axios';

const API_BASE_URL ='http://127.0.0.1:5000/api/auth'; // Assuming an /auth prefix for auth routes

export interface AuthResponse {
  message: string;
  token?: string; // Or user object
  user?: { id: string; email: string; name?: string }; // Example user structure
}

export interface AuthErrorResponse {
  error: string;
}

// Placeholder for login API call
export const loginUserApi = async (credentials: { email?: string; password?: string }): Promise<AuthResponse> => {
  console.log("Attempting login with:", credentials);
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === "test@example.com" && credentials.password === "password") {
        resolve({ 
            message: "Login successful!", 
            token: "fake-jwt-token", 
            user: { id: "1", email: "test@example.com", name: "Test User"} 
        });
      } else {
        reject({ error: "Invalid email or password" } as AuthErrorResponse);
      }
    }, 1000);
  });
  // Actual API call would look like:
  // try {
  //   const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, credentials);
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as AuthErrorResponse;
  //   }
  //   throw { error: 'An unexpected error occurred during login.' } as AuthErrorResponse;
  // }
};

// Placeholder for signup API call
export const signupUserApi = async (userData: { name?: string; email?: string; password?: string }): Promise<AuthResponse> => {
  console.log("Attempting signup with:", userData);
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password && userData.name) {
        // Simulate checking if email exists, etc.
        if (userData.email === "existing@example.com") {
            reject({ error: "Email already exists."} as AuthErrorResponse);
            return;
        }
        resolve({ 
            message: "Signup successful! Please login.",
            user: { id: String(Math.random()), email: userData.email, name: userData.name }
        });
      } else {
        reject({ error: "All fields are required for signup." } as AuthErrorResponse);
      }
    }, 1000);
  });
  // Actual API call:
  // try {
  //   const response = await axios.post<AuthResponse>(`${API_BASE_URL}/signup`, userData);
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as AuthErrorResponse;
  //   }
  //   throw { error: 'An unexpected error occurred during signup.' } as AuthErrorResponse;
  // }
};