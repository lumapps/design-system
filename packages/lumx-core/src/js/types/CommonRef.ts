export type CommonRef<T = HTMLElement> = {
    // Supports React's RefObject
    readonly current?: T | null;
    // Supports Vue's Ref
    value?: T;
};
