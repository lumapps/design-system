/** Find image in element including the element */
export const findImage = (element: HTMLElement | null): HTMLImageElement | null =>
    element?.matches('img') ? (element as HTMLImageElement) : element?.querySelector('img') || null;
