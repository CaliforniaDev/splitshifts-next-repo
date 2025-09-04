import sharp from 'sharp';
import path from 'node:path';

/**
 * Generate a blurred base64 placeholder using Sharp
 * 
 * @param imageSrc - Path to image relative to public directory (e.g., 'assets/auth/login-side-image.webp')
 * @returns Object with blurDataURL and image dimensions
 */
export async function getBlurredPlaceholder(imageSrc: string) {
  try {
    // Remove leading slash if present and construct full path
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.slice(1) : imageSrc;
    const imagePath = path.join(process.cwd(), 'public', cleanPath);
    
    const sharpImage = sharp(imagePath);
    
    // Get original image metadata
    const { width, height } = await sharpImage.metadata();
    
    // Create a small, blurred placeholder (10px wide, maintains aspect ratio)
    const placeholderBuffer = await sharpImage
      .resize(10) // Small size for performance
      .blur(1.5) // Apply blur for better placeholder effect
      .jpeg({ quality: 20 }) // JPEG compression for smaller size
      .toBuffer();
    
    const base64 = placeholderBuffer.toString('base64');
    const blurDataURL = `data:image/jpeg;base64,${base64}`;
    
    return {
      blurDataURL,
      width,
      height,
    };
    
  } catch (error) {
    console.warn(`Failed to generate blur for ${imageSrc}:`, error);
    return {
      blurDataURL: undefined,
      width: undefined,
      height: undefined,
    };
  }
}