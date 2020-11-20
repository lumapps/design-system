import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface RadioGroupProps extends GenericProps {
    /** The children elements. Should use RadioButton. */
    children: ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}RadioGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const RadioGroup: React.FC<RadioGroupProps> = ({ children, className, ...forwardedProps }) => (
    <div
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
RadioGroup.displayName = COMPONENT_NAME;

export { CLASSNAME, RadioGroup, RadioGroupProps };
