import imageCompression from "browser-image-compression";

export const convertImage = async (image: any, settings: any) => {
  const options = {
    maxWidthOrHeight: Math.max(settings.width, settings.height),
    useWebWorker: true,
    maintainAspectRatio: settings.maintainAspectRatio,
  };

  const compressedBlob = await imageCompression(image.file, options);
  return new Blob([compressedBlob], { type: `image/${settings.format}` });
}; 