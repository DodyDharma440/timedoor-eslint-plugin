<script setup lang="ts">
interface AppProps {
  message: string;
}

interface AppEmits {
  (e: "submit"): void;
}

defineProps<{ message: string; message2: string; message3: number }>();
defineEmits<AppEmits>();

const someFunc = (n1: number, n2: number) => {
  const result = n1 + n2;

  return result;
};

useAsyncData("data", () => $fetch("/api/data"));
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
