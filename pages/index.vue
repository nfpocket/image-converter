<template>
  <UContainer class="py-16">
    <div class="max-w-2xl mx-auto space-y-12">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Image Converter</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Convert and resize your images with ease</p>
        </div>
        <ColorModeToggle />
      </div>

      <ImageUpload
        v-model="uploadedImages"
        :settings="settings"
      />

      <ConversionSettings
        v-model:settings="settings"
        :first-image-aspect-ratio="firstImageAspectRatio"
      />

      <!-- Action Buttons -->
      <div class="flex justify-center gap-3">
        <UButton
          color="primary"
          :disabled="!canConvert"
          :loading="isConverting"
          @click="convertAndDownloadAll"
          size="lg"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-down-tray" />
          </template>
          Convert & Download All
        </UButton>

        <UButton
          v-if="canReset"
          color="error"
          variant="soft"
          @click="resetAll"
          size="lg"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-path" />
          </template>
          Reset
        </UButton>
      </div>

      <Footer />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import type { ConversionSettings, ImageFile } from "~/types/image";

const uploadedImages = ref<ImageFile[]>([]);
const isConverting = ref(false);

const defaultSettings: ConversionSettings = {
  mode: 'format-only',
  format: "webp",
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  keepOriginalSize: false,
  scalePercentage: 100,
  // Expert mode defaults
  quality: 0.8,
  maxSizeMB: 1,
  lossless: false,
};

const settings = ref<ConversionSettings>({ ...defaultSettings });

const firstImageAspectRatio = computed(() => uploadedImages.value[0]?.originalAspectRatio);

// Watch for changes in the first image to update dimensions
watch(() => uploadedImages.value[0], (newImage) => {
  if (newImage) {
    // Store original dimensions
    settings.value.originalWidth = newImage.originalWidth;
    settings.value.originalHeight = newImage.originalHeight;
    
    // If keep original size is enabled, use original dimensions
    if (settings.value.keepOriginalSize) {
      settings.value.width = newImage.originalWidth!;
      settings.value.height = newImage.originalHeight!;
    } else if (settings.value.maintainAspectRatio) {
      // If maintaining aspect ratio, adjust height based on current width
      settings.value.height = Math.round(settings.value.width / newImage.originalAspectRatio!);
    }
  }
}, { immediate: true });

// Watch for changes in keepOriginalSize
watch(() => settings.value.keepOriginalSize, (keepOriginal) => {
  if (keepOriginal && uploadedImages.value[0]) {
    // Restore original dimensions
    settings.value.width = uploadedImages.value[0].originalWidth!;
    settings.value.height = uploadedImages.value[0].originalHeight!;
  }
});

const canConvert = computed(() => uploadedImages.value.length > 0);
const canReset = computed(() => {
  // Check if there are images to clear
  if (uploadedImages.value.length > 0) return true;

  // Check if any setting has been changed from default
  return Object.keys(defaultSettings).some((key) => settings.value[key as keyof ConversionSettings] !== defaultSettings[key as keyof ConversionSettings]);
});

const resetAll = () => {
  uploadedImages.value = [];
  settings.value = { ...defaultSettings };
};

const convertImage = async (image: ImageFile, settings: ConversionSettings) => {
  // For format-only mode, just change the format without any compression
  if (settings.mode === 'format-only') {
    return new Blob([await image.file.arrayBuffer()], { type: `image/${settings.format}` });
  }

  const options = {
    // Only apply size constraints for resize mode or when not keeping original size in compress mode
    maxWidthOrHeight: (settings.mode === 'resize' || (settings.mode === 'compress' && !settings.keepOriginalSize)) 
      ? Math.max(settings.width, settings.height) 
      : undefined,
    useWebWorker: true,
    // Only apply compression settings in compress mode
    ...(settings.mode === 'compress' && {
      maxSizeMB: settings.maxSizeMB,
      quality: settings.quality,
    }),
    // Apply lossless for WebP in any mode if set in expert mode
    ...(settings.format === 'webp' && { lossless: settings.lossless }),
  };

  const compressedBlob = await imageCompression(image.file, options);
  return new Blob([compressedBlob], { type: `image/${settings.format}` });
};

const convertAndDownloadAll = async () => {
  isConverting.value = true;
  try {
    // If there's only one image, download it directly without creating a zip
    if (uploadedImages.value.length === 1) {
      // Set converting state for the single image
      uploadedImages.value[0].isConverting = true;
      const blob = await convertImage(uploadedImages.value[0], settings.value);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const originalName = uploadedImages.value[0].file.name;
      const baseName = originalName.replace(/\.[^/.]+$/, "");
      link.download = `${baseName}.${settings.value.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      uploadedImages.value[0].isConverting = false;
      return;
    }

    // For multiple images, create a zip
    // Set converting state for all images
    uploadedImages.value.forEach(img => img.isConverting = true);
    
    const zip = new JSZip();
    const convertedBlobs = await Promise.all(uploadedImages.value.map((image) => convertImage(image, settings.value)));

    convertedBlobs.forEach((blob, index) => {
      const originalName = uploadedImages.value[index].file.name;
      const extension = settings.value.format;
      // Remove the original extension and add the new one
      const baseName = originalName.replace(/\.[^/.]+$/, "");
      const fileName = `${baseName}.${extension}`;
      zip.file(fileName, blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted-images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error converting images:", error);
  } finally {
    isConverting.value = false;
    // Reset converting state for all images
    uploadedImages.value.forEach(img => img.isConverting = false);
  }
};
</script>
