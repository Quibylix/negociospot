export async function compressImage(file: File) {
  const imageCompression = await import("browser-image-compression").then(
    (mod) => mod.default,
  );
  const heic2any = await import("heic2any").then((mod) => mod.default);

  let processingFile = file;

  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic")
  ) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
      });
      processingFile = new File(
        [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
        file.name.replace(/\.[^/.]+$/, ".jpg"),
        { type: "image/jpeg" },
      );
    } catch (error) {
      console.error("Error converting HEIC to JPEG:", error);
      throw new Error("Error converting HEIC image");
    }
  }

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  };

  try {
    const compressedBlob = await imageCompression(processingFile, options);
    return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, ".webp"), {
      type: "image/webp",
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}
