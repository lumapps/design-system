import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends GenericProps {
    /**
     * List of radio buttons in the group (should use <RadioButton>).
     */
    children: ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}RadioGroup`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Radio group component.
 *
 * @return The component.
 */
export const RadioGroup: React.FC<RadioGroupProps> = (props) => {
    const { className, children, ...forwardedProps } = props;

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            {...forwardedProps}
        >
            {children}
        </div>
    );
};
RadioGroup.displayName = COMPONENT_NAME;
