<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="relative group space-y-2"
    >
      <div class="relative">
        <img
          :src="image.preview"
          class="w-full h-32 object-cover rounded-lg shadow-sm dark:shadow-gray-800"
          :class="{ 'opacity-50': image.isConverting }"
        />
        <div
          v-if="image.isConverting"
          class="absolute inset-0 flex items-center justify-center"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-6 h-6 text-primary-500 dark:text-primary-400 animate-spin"
          />
        </div>
      </div>
      <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>Format: {{ image.file.type.split('/')[1].toUpperCase() }}</p>
        <p>Size: {{ formatFileSize(image.file.size) }}</p>
        <p>Dimensions: {{ image.originalWidth }}×{{ image.originalHeight }}px</p>
      </div>
      <div class="flex gap-2">
        <UButton
          size="xs"
          color="primary"
          :loading="image.isConverting"
          :disabled="image.isConverting"
          @click="$emit('convert-and-download', index)"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-down-tray" />
          </template>
          Convert & Download
        </UButton>
        <UButton
          size="xs"
          color="error"
          variant="soft"
          icon="i-heroicons-x-mark"
          :disabled="image.isConverting"
          @click="$emit('remove', index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageFile, ConversionSettings } from '~/types/image';

defineProps<{
  images: ImageFile[];
  settings: ConversionSettings;
}>();

defineEmits<{
  (e: 'remove', index: number): void;
  (e: 'convert-and-download', index: number): void;
}>();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script> 