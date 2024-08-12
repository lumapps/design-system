/** Generate a range of number starting at 0 and ending before the given number */
export const range = (end: number) => Array.from({ length: end }, (_, i) => i);
