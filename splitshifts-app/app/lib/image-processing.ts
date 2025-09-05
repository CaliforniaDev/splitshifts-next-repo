import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Generate a blurred base64 placeholder using Sharp with enhanced color options
 * 
 * @param imageSrc - Path to image relative to public directory (e.g., 'assets/auth/login-side-image.webp')
 * @param options - Configuration for blur generation
 * @returns Object with blurDataURL and image dimensions
 */
export async function getBlurredPlaceholder(
  imageSrc: string,
  options: {
    size?: number;           // Placeholder size (default: 20)
    blur?: number;           // Blur amount (default: 2)
    saturation?: number;     // Saturation multiplier (default: 1.3)
    brightness?: number;     // Brightness multiplier (default: 1.1)
    quality?: number;        // JPEG quality (default: 30)
    vibrant?: boolean;       // Use extra vibrant processing (default: false)
  } = {}
) {
  const {
    size = 20,
    blur = 2,
    saturation = 1.3,
    brightness = 1.1,
    quality = 30,
    vibrant = false
  } = options;

  // Remove leading slash if present and construct full path
  const cleanPath = imageSrc.startsWith('/') ? imageSrc.slice(1) : imageSrc;
  const imagePath = path.join(process.cwd(), 'public', cleanPath);

  try {
    // Check if we can access the file
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at: ${imagePath}`);
    }
    
    // Initialize Sharp with the image path
    const baseSharpImage = sharp(imagePath);
    
    // Get original image metadata first
    const { width, height } = await baseSharpImage.metadata();
    
    // Create a new Sharp instance for processing (avoid reusing the same instance)
    let sharpImage = sharp(imagePath);
    
    // Apply vibrant processing if requested
    if (vibrant) {
      sharpImage = sharpImage
        .gamma(1.2) // Increase mid-tone contrast
        .linear(1.2, -10); // Increase contrast and reduce darkness
    }
    
    // Create a small, blurred placeholder with enhanced colors
    const placeholderBuffer = await sharpImage
      .resize(size) // Configurable size for more color detail
      .modulate({
        saturation: saturation, // Boost saturation
        brightness: brightness, // Adjust brightness
      })
      .blur(blur) // Configurable blur amount
      .jpeg({ 
        quality: quality, // Higher quality to preserve colors
        progressive: true, // Better compression for gradients
      })
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
    console.warn(`Attempted path: ${imagePath}`);
    return {
      blurDataURL: undefined,
      width: undefined,
      height: undefined,
    };
  }
}