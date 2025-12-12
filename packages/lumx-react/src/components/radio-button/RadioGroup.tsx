import { ReactNode } from 'react';

import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends GenericProps {
    /** RadioButton elements */
    children: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'RadioGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-radio-group';

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioGroup = forwardRef<RadioGroupProps, HTMLDivElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
});
RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
