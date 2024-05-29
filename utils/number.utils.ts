export const isPositiveNumber = (n: unknown): n is number => typeof n === 'number' && n >= 0;
