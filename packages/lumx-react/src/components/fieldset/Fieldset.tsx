import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { Emphasis } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/** Defines the props of the component. */
interface FieldsetProps extends GenericProps {
    legend?: ReactElement | string;
    hasFirstInputWithElevation?: boolean;
    emphasis?: Emphasis;
}

const COMPONENT_NAME = `${COMPONENT_PREFIX}Fieldset`;

/** The default class name and classes prefix for this component. */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const Fieldset: React.FC<FieldsetProps> = ({
    className = '',
    children,
    legend,
    hasFirstInputWithElevation = false,
    emphasis = Emphasis.low,
    ...props
}) => (
    <fieldset className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {legend && (
            <legend
                className={classNames(`${CLASSNAME}__legend`, {
                    [`${CLASSNAME}--with-negative-margin-bottom`]: hasFirstInputWithElevation,
                    [`${CLASSNAME}--emphasis-high`]: emphasis === Emphasis.high,
                    [`${CLASSNAME}--emphasis-medium`]: emphasis === Emphasis.medium,
                    [`${CLASSNAME}--emphasis-low`]: emphasis === Emphasis.low,
                })}
            >
                {legend}
            </legend>
        )}
        {children}
    </fieldset>
);

Fieldset.displayName = COMPONENT_NAME;

export { CLASSNAME, Fieldset, FieldsetProps };
