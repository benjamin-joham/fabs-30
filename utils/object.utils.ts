/**
 * Checks if the given value is a native JS Object with values.
 */
export const isPopulatedObject = (value?: unknown) =>
  !!(
    value &&
    typeof value === 'object' &&
    value.constructor === Object &&
    Object.keys(value).length > 0
  );
