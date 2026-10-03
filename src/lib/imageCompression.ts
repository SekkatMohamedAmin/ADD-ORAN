/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Reduces 5-15MB phone camera photos to ~150-350KB while maintaining high visual clarity.
 * Prevents Vercel 413 FUNCTION_PAYLOAD_TOO_LARGE errors.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  // If not an image (e.g. PDF), return as is
  if (!file || !file.type.startsWith("image/")) {
    return file;
  }

  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;

  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate proportional constrained dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(file);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          // If compressed is unexpectedly larger than original, keep original
          if (blob.size >= file.size) {
            return resolve(file);
          }

          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          const compressedFile = new File([blob], newFileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback to original file if decode fails
    };

    img.src = objectUrl;
  });
}
