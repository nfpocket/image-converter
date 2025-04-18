<template>
  <UCard class="shadow-lg">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Conversion Settings</h2>
    </template>

    <div class="space-y-6">
      <UFormField label="Conversion Mode">
        <USelect
          v-model="settings.mode"
          :items="[
            { label: 'Format Only - Just convert file type', value: 'format-only' },
            { label: 'Resize - Change dimensions', value: 'resize' },
            { label: 'Compress - Optimize file size', value: 'compress' },
          ]"
        />
      </UFormField>

      <UFormField label="Target Format">
        <URadioGroup
          v-model="settings.format"
          :items="formatOptions"
          class="flex gap-4"
        />
      </UFormField>

      <!-- WebP Lossless Option -->
      <UFormField
        v-if="settings.format === 'webp'"
        label="Lossless WebP"
      >
        <USwitch v-model="settings.lossless" />
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Better quality but larger file size</span>
      </UFormField>

      <!-- Resize Options -->
      <template v-if="settings.mode === 'resize'">
        <div class="space-y-4">
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
      </template>

      <!-- Compression Options -->
      <template v-if="settings.mode === 'compress'">
        <UFormField label="Keep Original Size">
          <USwitch v-model="settings.keepOriginalSize" />
        </UFormField>

        <div
          v-if="!settings.keepOriginalSize"
          class="space-y-4"
        >
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
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ Math.round(settings.quality * 100) }}%</span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Lower quality means smaller file size</span>
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
        </div>
      </template>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ConversionSettings } from "~/types/image";

const props = defineProps<{
  settings: ConversionSettings;
  firstImageAspectRatio?: number;
}>();

const emit = defineEmits<{
  (e: "update:settings", settings: ConversionSettings): void;
}>();

const settings = computed({
  get: () => props.settings,
  set: (value) => emit("update:settings", value),
});

const formatOptions = [
  { label: "PNG", value: "png" },
  { label: "WebP", value: "webp" },
];

const handleDimensionChange = (dimension: "width" | "height") => {
  if (!settings.value.maintainAspectRatio || !props.firstImageAspectRatio) return;

  if (dimension === "width" && settings.value.width) {
    settings.value.height = Math.round(settings.value.width / props.firstImageAspectRatio);
  } else if (dimension === "height" && settings.value.height) {
    settings.value.width = Math.round(settings.value.height * props.firstImageAspectRatio);
  }
};
</script>
