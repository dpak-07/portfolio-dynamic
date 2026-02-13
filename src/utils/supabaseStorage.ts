import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'deepak';

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder to upload to (e.g., 'projects', 'about', 'certifications')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string = 'projects'): Promise<string> {
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Upload a PDF file to Supabase Storage
 * @param file - The PDF file to upload
 * @param folder - The folder to upload to (default: 'resumes')
 * @returns The public URL of the uploaded PDF
 */
export async function uploadPDF(file: File, folder: string = 'resumes'): Promise<string> {
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF');
    }

    // Generate unique filename
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf'
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
    if (!url) return;

    try {
        // Extract file path from URL
        const urlParts = url.split(`${BUCKET_NAME}/`);
        if (urlParts.length < 2) {
            throw new Error('Invalid URL format');
        }

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            throw new Error(`Delete failed: ${error.message}`);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        // Don't throw - deletion errors shouldn't break the app
    }
}

// Keep deleteImage as alias for backward compatibility
export const deleteImage = deleteFile;
