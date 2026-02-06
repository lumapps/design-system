import type { ReactElement, Ref } from 'react';
import type { GenericProps } from '@lumx/core/js/types/GenericProps';

/** LumX Component Type. */
export type Comp<P, T = HTMLElement> = {
    (props: P & { ref?: Ref<T> } & GenericProps): ReactElement | null;
    /** React component type. */
    readonly $$typeof: symbol;
    /** Component default props. */
    defaultProps?: Partial<P>;
    /** Component name. */
    displayName?: string;
    /** Component base class name. */
    className?: string;
};
