<script setup lang="ts">
interface AppProps {
  message: string;
}

const someFunc = (n1: number, n2: number) => {
  const result = n1 + n2;

  return result;
};

console.log("asdasad");

interface AppEmits {
  submit: (value: string) => void;
}

defineProps<{ hello: string }>();
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
