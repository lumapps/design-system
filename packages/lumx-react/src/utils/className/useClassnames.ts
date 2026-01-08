import { useMemo } from 'react';

import { classNames } from '@lumx/core/js/utils';

/**
 * Hook that provides BEM class name utilities for a component.
 *
 * @param className - Base component class name (kebab-case)
 * @returns Object with `block` and `element` utility functions
 *
 * @example
 * const { block, element } = useClassnames('my-component');
 */
export function useClassnames(className: string) {
    return useMemo(() => {
        return {
            /**
             * Generates BEM block class names with optional modifiers.
             *
             * @param modifier - Modifier string, object, or additional class names
             * @param additionalClasses - Additional CSS classes to append
             * @returns Generated class name string
             *
             * @example
             * block() // 'my-component'
             * block('active') // 'my-component my-component--active'
             * block({ active: true, disabled: false }) // 'my-component my-component--active'
             * block(['custom-class']) // 'my-component custom-class'
             */
            block: classNames.bem.block(className),
            /**
             * Generates BEM element class names with optional modifiers.
             *
             * @param elementName - Element name
             * @param modifier - Modifier string, object, or additional class names
             * @param additionalClasses - Additional CSS classes to append
             * @returns Generated class name string
             *
             * @example
             * element('header') // 'my-component__header'
             * element('header', 'large') // 'my-component__header my-component__header--large'
             * element('header', { large: true, small: false }) // 'my-component__header my-component__header--large'
             * element('header', ['custom-class']) // 'my-component__header custom-class'
             */
            element: classNames.bem.element(className),
        };
    }, [className]);
}
