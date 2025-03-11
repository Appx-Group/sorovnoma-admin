import axios from "axios";
import { generateMediaAuthKey } from "@/lib/utils";

// Use exact base URL format from original implementation
const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://media-api.main-gate.appx.uz';

// Define API paths to match the urls.media.* format from original implementation
const apiPaths = {
    create: '/api/v1/aws',
    delete: '/api/v1/aws/delete',
    multiple: '/api/v1/aws/multiple'
};

// Create a separate instance for the Media API
const mediaApi = axios.create({
    baseURL: mediaBaseUrl,
    timeout: 30000, // 30 second timeout for file uploads
});

// Add auth key to every request
mediaApi.interceptors.request.use((config) => {
    try {
        const authKey = generateMediaAuthKey();
        config.headers["x-auth-key"] = authKey;
    } catch (error) {
        console.error("Failed to generate auth key:", error);
    }
    return config;
});

class MediaService {
    /**
     * Upload a single file to the Media API
     * @param file The file to upload
     * @returns Promise with the upload response
     */
    async uploadFile(file: File) {
        try {
            if (!file) {
                throw new Error("No file provided");
            }
            
            // Check file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                throw new Error("File size exceeds 5MB limit");
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error("File type not supported. Please upload a JPEG or PNG image.");
            }
            
            const formData = new FormData();
            formData.append("file", file);
            formData.append("project", import.meta.env.VITE_IMAGE_UPLOAD_CLIENT || "ovoz");
            
            const response = await mediaApi.post(apiPaths.create, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            // Check if the response data has the expected structure (url, key, project, id)
            const data = response.data;
            if (data && data.url && data.key) {
                // This is a successful response with proper structure
                return {
                    success: true,
                    data: data,
                    message: "File uploaded successfully"
                };
            } else {
                // If we don't have the expected fields, consider it an error
                console.error("Unexpected response structure:", data);
                throw new Error("Invalid response from media server");
            }
        } catch (error: any) {
            console.error("Error uploading file to Media API:", error);
            
            const errorResponse = {
                success: false,
                message: error.message || "Failed to upload file",
                error: error,
            };
            
            return errorResponse;
        }
    }

    /**
     * Upload multiple files to the Media API
     * @param files Array of files to upload
     * @returns Promise with the upload response
     */
    async uploadMultipleFiles(files: File[]) {
        try {
            if (!files || !files.length) {
                throw new Error("No files provided");
            }
            
            const formData = new FormData();
            
            files.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
            
            formData.append("project", import.meta.env.VITE_IMAGE_UPLOAD_CLIENT || "ovoz");
            
            const response = await mediaApi.post(apiPaths.multiple, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            return {
                success: true,
                data: response.data,
                message: "Files uploaded successfully"
            };
        } catch (error: any) {
            console.error("Error uploading multiple files:", error);
            
            const errorResponse = {
                success: false,
                message: error.message || "Failed to upload multiple files",
                error: error,
            };
            
            return errorResponse;
        }
    }

    /**
     * Delete a file from the Media API
     * @param fileId The ID of the file to delete
     * @returns Promise with the deletion response
     */
    async deleteFile(fileId: string) {
        try {
            if (!fileId) {
                throw new Error("No file ID provided");
            }
            
            // Create payload with just the key parameter, matching original implementation
            const payload = {
                key: fileId,
                project: import.meta.env.VITE_IMAGE_UPLOAD_CLIENT || "ovoz"
            };
            
            // Make request 
            const response = await mediaApi.post(apiPaths.delete, payload);
            
            // Log full response for debugging
            console.log("Delete response:", response.data);
            
            // Check if we have a valid response
            if (response.data && (response.data.key || response.data.success)) {
                return {
                    success: true,
                    data: response.data,
                    message: "File deleted successfully"
                };
            } else {
                // If response has an error message, use it
                if (response.data && response.data.message) {
                    throw new Error(response.data.message);
                } else {
                    throw new Error("Failed to delete file: Unexpected response format");
                }
            }
        } catch (error: any) {
            console.error("Error deleting file:", error);
            
            const errorResponse = {
                success: false,
                message: error.message || "Failed to delete file",
                error: error,
            };
            
            return errorResponse;
        }
    }
}

export const mediaService = new MediaService(); 