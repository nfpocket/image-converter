<template>
  <UCard class="shadow-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Upload Images</h2>
        <UBadge
          v-if="modelValue.length > 0"
          color="primary"
        >
          {{ modelValue.length }} image{{ modelValue.length > 1 ? "s" : "" }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <div
        class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary-500 transition-colors relative min-h-[200px] flex flex-col items-center justify-center"
        :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragging || isProcessing }"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          @change="handleFileUpload"
          class="hidden"
          id="file-upload"
          ref="fileInput"
        />
        
        <div v-if="isProcessing" class="text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-12 h-12 text-primary-500 dark:text-primary-400 mx-auto mb-4 animate-spin"
          />
          <p class="text-gray-600 dark:text-gray-400 mb-2">Processing images...</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">This might take a moment</p>
        </div>
        
        <div v-else class="text-center">
          <UIcon
            name="i-heroicons-photo"
            class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400 mb-2">Drag and drop your images here</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">or click to browse</p>
        </div>
      </div>

      <ImageGrid
        v-if="modelValue.length > 0"
        :images="modelValue"
        :settings="settings"
        @remove="removeImage"
        @convert-and-download="convertAndDownloadSingle"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ImageFile, ConversionSettings } from '~/types/image';
import { convertImage } from '~/utils/image';

const props = defineProps<{
  modelValue: ImageFile[];
  settings: ConversionSettings;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', images: ImageFile[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isProcessing = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  
  const files = e.dataTransfer?.files;
  if (!files?.length) return;
  
  processFiles(files);
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  processFiles(input.files);
};

const processFiles = async (files: FileList) => {
  isProcessing.value = true;
  const fileArray = Array.from(files);
  const newImages = [...props.modelValue];
  let processedCount = 0;

  try {
    await Promise.all(fileArray.map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            newImages.push({
              file,
              preview: e.target?.result as string,
              originalAspectRatio: img.width / img.height,
              originalWidth: img.width,
              originalHeight: img.height,
            });
            
            processedCount++;
            resolve();
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }));

    emit('update:modelValue', newImages);
  } finally {
    isProcessing.value = false;
  }
};

const removeImage = (index: number) => {
  const newImages = [...props.modelValue];
  newImages.splice(index, 1);
  emit('update:modelValue', newImages);
};

const convertAndDownloadSingle = async (index: number) => {
  const image = props.modelValue[index];
  if (!image) return;

  image.isConverting = true;
  try {
    const convertedBlob = await convertImage(image, props.settings);
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted-image-${index + 1}.${props.settings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error converting image:", error);
  } finally {
    image.isConverting = false;
  }
};
</script> 