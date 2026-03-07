<script setup lang="ts">
interface AppProps {
  message: string;
}

interface AppEmits {
  submit: (value: string) => void;
}

defineProps<AppProps>();
defineEmits<AppEmits>();

if (import.meta.client) {
  useAsyncData("data", () => $fetch("/api/data"));
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
