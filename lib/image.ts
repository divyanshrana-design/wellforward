/**
 * Client-side image compression for avatar uploads.
 *
 * Phone photos are often 3-12MB. Base64-encoding them and POSTing to a
 * serverless function easily blows past Vercel's 4.5MB request-body limit,
 * which would make /api/register fail *after* the user already verified their
 * email. Compressing to a small square JPEG keeps every upload well under
 * ~200KB so registration is fast and reliable even with 100+ people at once.
 */
export async function compressImage(
  file: File,
  maxSize = 512,
  quality = 0.82
): Promise<string> {
  // Non-images (shouldn't happen given accept="image/*") - just read as-is.
  if (!file.type.startsWith('image/')) {
    return readAsDataUrl(file);
  }

  const dataUrl = await readAsDataUrl(file);

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Scale down so the longest edge is at most maxSize, keeping aspect.
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl); // fallback: original
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Always output JPEG for predictable, small size.
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(dataUrl); // any failure → fall back to original
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
