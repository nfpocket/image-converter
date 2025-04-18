<template>
  <UCard class="shadow-lg">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Conversion Settings</h2>
        <UButton
          size="xs"
          :color="isExpertMode ? 'primary' : 'neutral'"
          @click="isExpertMode = !isExpertMode"
        >
          <template #leading>
            <UIcon name="i-heroicons-adjustments-horizontal" />
          </template>
          Expert Mode
        </UButton>
      </div>
    </template>

    <div class="space-y-6">
      <UFormField label="Target Format">
        <URadioGroup
          v-model="settings.format"
          :items="formatOptions"
          class="flex gap-4"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Width (px)">
          <UInput
            v-model.number="settings.width"
            type="number"
            min="1"
            placeholder="Enter width"
            @input="handleDimensionChange('width')"
          />
        </UFormField>

        <UFormField label="Height (px)">
          <UInput
            v-model.number="settings.height"
            type="number"
            min="1"
            placeholder="Enter height"
            @input="handleDimensionChange('height')"
          />
        </UFormField>
      </div>

      <UFormField label="Maintain Aspect Ratio">
        <USwitch v-model="settings.maintainAspectRatio" />
      </UFormField>

      <template v-if="isExpertMode">
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Compression Settings</h3>
          
          <div class="space-y-4">
            <UFormField label="Quality">
              <div class="flex gap-2 items-center max-w-xs">
                <UInput
                  v-model.number="settings.quality"
                  type="number"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  placeholder="Quality"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ Math.round(settings.quality * 100) }}%
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                Lower quality means smaller file size
              </span>
            </UFormField>

            <UFormField label="Maximum File Size">
              <div class="flex gap-2 items-center max-w-xs">
                <UInput
                  v-model.number="settings.maxSizeMB"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Max size"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">MB</span>
              </div>
            </UFormField>

            <UFormField v-if="settings.format === 'webp'" label="Lossless">
              <USwitch v-model="settings.lossless" />
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                Better quality but larger file size
              </span>
            </UFormField>
          </div>
        </div>
      </template>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ConversionSettings } from '~/types/image';

const props = defineProps<{
  settings: ConversionSettings;
  firstImageAspectRatio?: number;
}>();

const emit = defineEmits<{
  (e: 'update:settings', settings: ConversionSettings): void;
}>();

const settings = computed({
  get: () => props.settings,
  set: (value) => emit('update:settings', value),
});

const isExpertMode = ref(false);

const formatOptions = [
  { label: "PNG", value: "png" },
  { label: "WebP", value: "webp" },
];

const handleDimensionChange = (dimension: 'width' | 'height') => {
  if (!settings.value.maintainAspectRatio || !props.firstImageAspectRatio) return;

  if (dimension === 'width' && settings.value.width) {
    settings.value.height = Math.round(settings.value.width / props.firstImageAspectRatio);
  } else if (dimension === 'height' && settings.value.height) {
    settings.value.width = Math.round(settings.value.height * props.firstImageAspectRatio);
  }
};
</script> 