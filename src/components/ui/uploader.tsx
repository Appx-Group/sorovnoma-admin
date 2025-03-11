/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useId } from "react";
import { Modal, Upload, message } from "antd";
import type { UploadFile } from "antd";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { mediaService } from "@/services/api/media";
import { customToast } from "@/lib/utils";

interface IMediaResponse {
    url: string;
    key: string;
    project: string;
    id: number;
}

type UploadProps = {
    image_url?: string;
    name?: string;
    setFile?: (value: File) => void;
    onUploadSuccess?: (data: any) => void;
};

const Uploader = ({ image_url, name, onUploadSuccess }: UploadProps) => {
    const ID = useId();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
    const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

    // Initialize file list if image_url is provided
    useEffect(() => {
        if (image_url && image_url.trim()) {
            setFileList([
                {
                    uid: ID,
                    status: "done",
                    name: name || "Uploaded image",
                    url: image_url,
                },
            ]);
        }
    }, [image_url, name, ID]);

    // Custom request handler for Ant Design Upload
    const handleUpload = async ({ file }: RcCustomRequestOptions) => {
        if (!(file instanceof File)) {
            customToast("ERROR", "Invalid file format");
            return;
        }

        setIsUploading(true);
        
        try {
            const response = await mediaService.uploadFile(file);
            
            // Log the complete response for debugging
            console.log("Media API Response:", response);
            
            if (response && response.success) {
                // Check if data property exists in the response
                const responseData = 'data' in response ? response.data : null;
                
                if (responseData) {
                    // The response.data now has the format: { url, key, project, id }
                    const mediaData = responseData as IMediaResponse;
                    
                    // Update file list with the response data
                    setFileList([
                        {
                            uid: String(mediaData.id),
                            status: "done",
                            name: file.name,
                            url: mediaData.url,
                            // Store the file key for deletion
                            originFileObj: {
                                ...file,
                                uid: String(mediaData.id),
                                key: mediaData.key,
                            } as any
                        },
                    ]);
                    
                    // Call the onUploadSuccess callback
                    if (onUploadSuccess) {
                        onUploadSuccess({
                            success: true,
                            data: mediaData
                        });
                    }
                    
                    customToast("SUCCESS", "File uploaded successfully");
                } else {
                    // Show detailed error from the response
                    const errorMsg = response?.message || "Unknown upload error";
                    console.error("Upload error:", errorMsg);
                    customToast("ERROR", errorMsg);
                }
            } else {
                // Show detailed error from the response
                const errorMsg = response?.message || "Unknown upload error";
                console.error("Upload error:", errorMsg);
                customToast("ERROR", errorMsg);
            }
        } catch (error: any) {
            console.error("Error uploading file:", error);
            customToast("ERROR", "Failed to upload file: " + (error.message || "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };

    // Open delete confirmation modal
    const openDeleteModal = (file: UploadFile) => {
        // Extract key using the EXACT same method as the original implementation
        let fileKey = null;
        
        if (file.url) {
            try {
                // This matches exactly the original: const loc = new URL(file.url as string); const key = loc.pathname.slice(1);
                const loc = new URL(file.url as string);
                // Use decodeURIComponent to ensure proper URL encoding
                fileKey = decodeURIComponent(loc.pathname.slice(1));
            } catch (e) {
                // Fall back to other methods if URL parsing fails
                if (file.originFileObj && (file.originFileObj as any).key) {
                    fileKey = (file.originFileObj as any).key;
                } else {
                    // Last resort: use the uid
                    fileKey = file.uid;
                }
            }
        } else {
            // If no URL, try originFileObj or uid
            if (file.originFileObj && (file.originFileObj as any).key) {
                fileKey = (file.originFileObj as any).key;
            } else {
                fileKey = file.uid;
            }
        }
        
        setDeleteUrl(file.url as string);
        setDeleteFileId(fileKey);
        setDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setDeleteUrl(null);
        setDeleteFileId(null);
        setDeleteModalOpen(false);
    };

    // Handle file deletion
    const handleDelete = async () => {
        if (!deleteFileId) {
            customToast("ERROR", "No file ID found for deletion");
            closeDeleteModal();
            return;
        }

        try {
            // Check if we should skip API deletion for certain URLs
            if (deleteUrl && (
                deleteUrl.includes('placeholder') || 
                deleteUrl.includes('example.com') ||
                deleteUrl.startsWith('data:')
            )) {
                setFileList([]);
                if (onUploadSuccess) {
                    onUploadSuccess({ success: true, data: null });
                }
                customToast("SUCCESS", "Image removed");
                closeDeleteModal();
                return;
            }
            
            const response = await mediaService.deleteFile(deleteFileId);
            
            // Always clear the UI regardless of API response
            setFileList([]);
            
            if (onUploadSuccess) {
                onUploadSuccess({ success: true, data: null });
            }
            
            if (response && response.success) {
                customToast("SUCCESS", "File deleted successfully");
            } else {
                customToast("SUCCESS", "Image removed from form");
            }
        } catch (error: any) {
            console.error("Error deleting file:", error);
            customToast("ERROR", "Failed to delete file: " + (error.message || "Unknown error"));
            
            // Still clear the UI to avoid blocking the user
            setFileList([]);
            if (onUploadSuccess) {
                onUploadSuccess({ success: true, data: null });
            }
        } finally {
            closeDeleteModal();
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center p-4 border-dashed border-2 border-gray-300 rounded">
            {isUploading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full mb-1"></div>
            ) : (
                <div className="text-blue-500 text-xl mb-1">+</div>
            )}
            <p>{isUploading ? "Uploading..." : "Upload"}</p>
        </div>
    );

    return (
        <>
            <Upload
                disabled={isUploading}
                fileList={fileList}
                listType="picture-card"
                customRequest={handleUpload}
                onRemove={(file) => openDeleteModal(file)}
                beforeUpload={(file) => {
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                        message.error('You can only upload JPG/PNG file!');
                    }
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    if (!isLt5M) {
                        message.error('Image must smaller than 5MB!');
                    }
                    return isJpgOrPng && isLt5M;
                }}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            <Modal
                title="Delete Image"
                open={deleteModalOpen}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                    danger: true,
                    onClick: handleDelete,
                }}
                onCancel={closeDeleteModal}
            >
                <p>Are you sure you want to delete this image?</p>
                {deleteUrl && (
                    <div className="mt-2">
                        <img 
                            src={deleteUrl} 
                            alt="To be deleted" 
                            className="h-20 object-contain mx-auto my-2"
                        />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Uploader;
