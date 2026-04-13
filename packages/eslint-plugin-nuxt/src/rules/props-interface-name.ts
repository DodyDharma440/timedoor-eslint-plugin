import { createInterfaceNameRule } from "../utils/define-macro-rule";

export const propsInterfaceName = createInterfaceNameRule({
  macroName: "defineProps",
  ruleName: "props-interface-name",
  description: "Enforce naming convention for props interface",
  subjectLabel: "Props",
  defaultSuffix: "Props",
});
