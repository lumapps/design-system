import { ReactNode } from 'react';

import { GenericProps } from '@lumx/react/utils/type';
import { RadioGroup as UI, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/RadioGroup';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends GenericProps {
    /** RadioButton elements */
    children: ReactNode;
}

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioGroup = forwardRef<RadioGroupProps, HTMLDivElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return UI({
        ref,
        className,
        children,
        ...forwardedProps,
    });
});
RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
