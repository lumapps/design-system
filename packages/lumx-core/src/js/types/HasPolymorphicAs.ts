import type React from 'react';

import { ElementType } from './JSXElement';

export type HasPolymorphicAs<E extends ElementType> = React.ComponentPropsWithoutRef<E> & {
    /**
     * Customize the rendered component.
     */
    as?: E;
};
