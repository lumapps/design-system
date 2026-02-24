/** Return true if the browser does not support pointer hover */
export const isHoverNotSupported = (): boolean => !!window.matchMedia?.('(hover: none)').matches;
