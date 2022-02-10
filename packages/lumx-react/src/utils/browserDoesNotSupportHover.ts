/** Return true if the browser does not support pointer hover */
export const browserDoesNotSupportHover = (): boolean => !!window.matchMedia?.('(hover: none)').matches;
