import { createInterfaceNameRule } from "../utils/define-macro-rule";

export const emitsInterfaceName = createInterfaceNameRule({
  macroName: "defineEmits",
  ruleName: "emits-interface-name",
  description: "Enforce naming convention for emits interface/type",
  subjectLabel: "Emits",
  defaultSuffix: "Emits",
});
