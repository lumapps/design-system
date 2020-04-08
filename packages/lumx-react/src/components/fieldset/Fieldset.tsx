import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { Emphasis } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { InputHelper } from '../input-helper/InputHelper';

/** Defines the props of the component. */
interface FieldsetProps extends GenericProps {
    legend?: ReactElement | string;
    hasFirstInputWithElevation?: boolean;
    emphasis?: Emphasis;
    helper?: ReactElement | string;
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
    helper = '',
    ...props
}) => (
    <fieldset
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), {
            [`${CLASSNAME}--with-negative-margin-bottom`]: hasFirstInputWithElevation,
            [`${CLASSNAME}--emphasis-high`]: emphasis === Emphasis.high,
            [`${CLASSNAME}--emphasis-medium`]: emphasis === Emphasis.medium,
            [`${CLASSNAME}--emphasis-low`]: emphasis === Emphasis.low,
        })}
        {...props}
    >
        {legend && <legend>{legend}</legend>}
        {helper && <InputHelper>{helper}</InputHelper>}
        <div className={`${CLASSNAME}__wrapper`}>{children}</div>
    </fieldset>
);

Fieldset.displayName = COMPONENT_NAME;

export { CLASSNAME, Fieldset, FieldsetProps };
