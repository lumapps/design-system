import type { ReactElement, Ref } from 'react';

/** LumX Component Type. */
export type Comp<P, T = HTMLElement> = {
    (props: P & { ref?: Ref<T> }): ReactElement | null;
    /** React component type. */
    readonly $$typeof: symbol;
    /** Component default props. */
    defaultProps?: Partial<P>;
    /** Component name. */
    displayName?: string;
    /** Component base class name. */
    className?: string;
};
