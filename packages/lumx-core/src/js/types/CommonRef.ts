export type CommonRef<T = HTMLElement> = {
    // Supports React's RefObject
    readonly current: T | null;
    // Supports Vue's Ref
    value?: T;
};

export type FnRef<T = HTMLElement> = (value: T) => void;
