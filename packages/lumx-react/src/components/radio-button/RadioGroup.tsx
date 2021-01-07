import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioGroup: Comp<RadioGroupProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
        >
            {children}
        </div>
    );
});
RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
