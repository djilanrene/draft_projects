
/**
 * Resizes an image file before uploading.
 * @param file The image file to resize.
 * @param maxWidth The maximum width of the resized image.
 * @param quality The quality of the resized image (0 to 1).
 * @returns A promise that resolves with the resized image as a Blob.
 */
export function resizeImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        const width = scale < 1 ? maxWidth : img.width;
        const height = scale < 1 ? img.height * scale : img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas to Blob conversion failed'));
            }
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("FileReader did not produce a result."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
