import { defineStore } from "pinia";
import { foo } from "~/utils/example";

export const testStore = defineStore("tes", () => {
  const abc = ref(0);

  return { abc };
});
