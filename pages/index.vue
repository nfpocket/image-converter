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
  format: "webp",
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  scalePercentage: 100,
  // Expert mode defaults
  quality: 0.8,
  maxSizeMB: 1,
  lossless: false,
};

const settings = ref<ConversionSettings>({ ...defaultSettings });

const firstImageAspectRatio = computed(() => uploadedImages.value[0]?.originalAspectRatio);

// Watch for changes in the first image's aspect ratio and update settings accordingly
watch(firstImageAspectRatio, (newAspectRatio) => {
  if (newAspectRatio) {
    // Update original dimensions
    settings.value.originalWidth = uploadedImages.value[0]?.originalWidth;
    settings.value.originalHeight = uploadedImages.value[0]?.originalHeight;
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
  const options = {
    maxWidthOrHeight: Math.max(settings.width, settings.height),
    useWebWorker: true,
    maintainAspectRatio: settings.maintainAspectRatio,
  };

  const compressedBlob = await imageCompression(image.file, options);
  return new Blob([compressedBlob], { type: `image/${settings.format}` });
};

const convertAndDownloadAll = async () => {
  isConverting.value = true;
  try {
    const zip = new JSZip();
    const convertedBlobs = await Promise.all(uploadedImages.value.map((image) => convertImage(image, settings.value)));

    convertedBlobs.forEach((blob, index) => {
      const fileName = `converted-image-${index + 1}.${settings.value.format}`;
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
  }
};
</script>
