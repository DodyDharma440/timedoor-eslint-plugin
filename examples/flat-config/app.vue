<script setup lang="ts">
interface Props {
  message: string;
}

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
