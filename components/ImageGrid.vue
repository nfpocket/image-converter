<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="relative group space-y-2"
    >
      <img
        :src="image.preview"
        class="w-full h-32 object-cover rounded-lg shadow-sm dark:shadow-gray-800"
      />
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
          color="red"
          variant="soft"
          icon="i-heroicons-x-mark"
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