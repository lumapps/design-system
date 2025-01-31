import React from 'react';

export type HasPolymorphicAs<E extends React.ElementType> = React.ComponentPropsWithoutRef<E> & {
    /**
     * Customize the rendered component.
     */
    as?: E;
};
