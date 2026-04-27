<script setup lang="ts">
interface AppProps {
  message: string;
}

defineProps<AppProps>();

const emit = defineEmits<AppEmits>();

const someFunc = (n1: number, n2: number) => {
  const result = n1 + n2;
  
  return result;
};

console.log("asdasad");

interface AppEmits {
  submit: (value: string) => void;
}

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
