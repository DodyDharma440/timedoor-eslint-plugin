import { ESLintUtils } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

interface RuleListeners {
  template?: object;
  script?: ESLintUtils.RuleListener;
}

export const withTemplateVisitor = <
  M extends string,
  O extends readonly unknown[],
  C extends RuleContext<M, O>,
>(
  context: C,
  { template, script }: RuleListeners,
) => {
  const templateBodyVisitor = (context.sourceCode.parserServices as any)
    ?.defineTemplateBodyVisitor;
  const isVueParser = !!templateBodyVisitor;

  if (isVueParser) {
    return templateBodyVisitor(template ?? {}, script);
  }
  return script ?? {};
};

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://timedoor-eslint-plugin-nuxt.vercel.app/docs/eslint-rules/${name}`,
);
