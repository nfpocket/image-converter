<template>
  <UButton
    color="neutral"
    variant="ghost"
    :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
