// Cloudinary Configuration
const CLOUD_NAME = 'dbxktcwug';
const UPLOAD_PRESET = 'Karteji';

/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The file object to upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadToCloudinary = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
