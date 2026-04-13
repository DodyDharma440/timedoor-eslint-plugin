import { defineStore } from "pinia";

export const testStore = defineStore("tes", () => {
  const abc = ref(0);

  return { abc };
});
