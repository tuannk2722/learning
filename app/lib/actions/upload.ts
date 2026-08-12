'use server';

import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary SDK dùng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Helper: Upload buffer lên Cloudinary ───────────────────────────────────────
function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `learning/${folder}`,
          public_id: publicId,
          overwrite: true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload failed'));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

// ── Upload Avatar ──────────────────────────────────────────────────────────────
export async function uploadAvatar(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, GIF are allowed.' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicId = `avatar-${Date.now()}`;

    const url = await uploadBufferToCloudinary(buffer, 'avatars', publicId);
    return { success: true, url };
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    return { success: false, error: 'Failed to upload file.' };
  }
}

// ── Upload Lesson Image ────────────────────────────────────────────────────────
export async function uploadLessonImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, GIF are allowed.' };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 10MB.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicId = `lesson-${Date.now()}`;

    const url = await uploadBufferToCloudinary(buffer, 'lessons', publicId);
    return { success: true, url };
  } catch (error) {
    console.error('Failed to upload lesson image:', error);
    return { success: false, error: 'Failed to upload file.' };
  }
}

// ── Upload Flashcard Image ─────────────────────────────────────────────────────
export async function uploadFlashcardImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, GIF are allowed.' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicId = `flashcard-${Date.now()}`;

    const url = await uploadBufferToCloudinary(buffer, 'flashcards', publicId);
    return { success: true, url };
  } catch (error) {
    console.error('Failed to upload flashcard image:', error);
    return { success: false, error: 'Failed to upload file.' };
  }
}
