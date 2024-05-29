import { isPopulatedObject } from '@/utils/object.utils';
import { hyphenate, isString } from '@/utils/string.utils';

type Options = {
  elementOrModifier?: string | Record<string, string | boolean>;
  modifiers?: Record<string, string | boolean>;
};

const bem = (
  block: string,
  elementOrModifier?: Options['elementOrModifier'],
  modifiers?: Options['modifiers'],
) => {
  const elementClass = isString(elementOrModifier)
    ? hyphenate(`${block}__${elementOrModifier}`)
    : hyphenate(block);
  const modifierClasses = isPopulatedObject(elementOrModifier)
    ? Object.entries(elementOrModifier as Record<string, string | boolean>)
    : Object.entries(modifiers || {});

  const modifierResult = modifierClasses
    .filter(([, value]) => value)
    .map(([modifier, value]) => {
      if (typeof value === 'boolean') {
        return `${elementClass}--${hyphenate(modifier)}`;
      }

      return `${elementClass}--${hyphenate(modifier)}-${value}`;
    })
    .join(' ')
    .trim();

  if (modifierResult) {
    return `${elementClass} ${modifierResult}`;
  }

  return elementClass;
};

export const useBem =
  (block: string) =>
  (elementOrModifier?: Options['elementOrModifier'], modifiers?: Options['modifiers']) =>
    bem(`${block}`, elementOrModifier, modifiers);
