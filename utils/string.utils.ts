/**
 * Checks if the given value is a non-empty String.
 */
export const isString = (value: unknown) => value && typeof value === 'string';

/**
 * Converts the given camelCase String to kebab-case.
 */
export const hyphenate = (value: string) =>
  value
    .replace(/\B([A-Z])/g, '-$1') // eslint-disable-line unicorn/prefer-string-replace-all
    .toLowerCase();

/**
 * Wraps a <b> tag around the given highlightTerm of the base string.
 */
export const highlight = (base?: string, highlightTerm?: string): string => {
  if (!base || !highlightTerm) {
    return base || '';
  }

  const trimmedChars = highlightTerm.trim();

  if (trimmedChars.length < 3) {
    return base;
  }

  return base.replace(
    new RegExp(`${trimmedChars}(?!>)(?!</em)`, 'gi'),
    match => `<em>${match}</em>`,
  );
};
