import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Upload an image file to Firebase Storage
 * @param file The image File object
 * @param pathSubdir Target directory inside 'banners/' (e.g. 'hero', 'sidecards', 'promos', 'categories')
 * @param onProgress Optional progress callback (0-100)
 * @returns Promise with the public download URL
 */
export async function uploadBannerImage(
  file: File,
  pathSubdir: string = 'hero',
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error('Firebase Storage yapılandırılmamış veya aktif değil.');
  }

  // Validate image type
  if (!file.type.startsWith('image/')) {
    throw new Error('Yalnızca geçerli görsel dosyaları (.jpg, .png, .webp) yüklenebilir.');
  }

  // Max 10MB check
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Görsel boyutu 10MB üzerinde olamaz.');
  }

  // Create unique file path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `banners/${pathSubdir}/${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        reject(new Error(`Görsel yüklenirken hata oluştu: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err: any) {
          reject(new Error(`İndirme bağlantısı alınamadı: ${err.message}`));
        }
      }
    );
  });
}

/**
 * Safe delete old image from Firebase Storage (Only after new image is saved successfully)
 * Does not delete external or placeholder images.
 */
export async function safeDeleteStorageImage(imageUrl: string): Promise<void> {
  if (!isFirebaseConfigured() || !storage || !imageUrl) return;

  try {
    // Only attempt deletion if it belongs to Firebase Storage
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    }
  } catch (err) {
    // Non-blocking warning
    console.warn('Eski görsel silinirken atlandı:', err);
  }
}
