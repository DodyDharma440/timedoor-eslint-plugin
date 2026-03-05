<script setup lang="ts">
interface AppProps {
  message: string;
}

interface AppEmits {
  submit: (value: string) => void;
}

defineProps<AppProps>();
defineEmits<AppEmits>();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
