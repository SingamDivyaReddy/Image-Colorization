import axios from 'axios';

// Default to localhost if VITE_API_BASE_URL is not set in .env
const API_BASE_URL = '/api'; // Or VITE_API_BASE_URL in .env for production
export interface ColorizeResponse {
  message: string;
  originalImageUrl: string;
  colorizedImageUrl: string;
  warning?: string; // For non-critical issues from backend
}

export interface ColorizeErrorResponse {
  error: string;
  warning?: string; // Backend might send a warning even with an error
}

export const colorizeImageApi = async (formData: FormData): Promise<ColorizeResponse> => {
  try {
    const response = await axios.post<ColorizeResponse>(`${API_BASE_URL}/image-colorizer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Log warning from successful response if present
    if (response.data.warning) {
        console.warn("API Warning (Success Response):", response.data.warning);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = error.response.data as ColorizeErrorResponse;
      console.error("API Error Response Data:", errorData);
      // Log warning from error response if present
      if (errorData.warning) {
        console.warn("API Warning (Error Response):", errorData.warning);
      }
      // Throw the structured error data so the UI can use it
      throw errorData;
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      console.error("API No Response Error:", error.request);
      throw { error: 'No response from server. Please check your network connection or if the server is running.' } as ColorizeErrorResponse;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Request Setup Error:", error);
      throw { error: 'An unexpected error occurred while setting up the request.' } as ColorizeErrorResponse;
    }
  }
};