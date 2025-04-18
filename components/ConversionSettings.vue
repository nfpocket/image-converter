<template>
  <UCard class="shadow-lg">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Conversion Settings</h2>
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