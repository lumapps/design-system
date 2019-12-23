import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface IFieldsetProps extends IGenericProps {
    legend?: ReactElement | string;
}

const COMPONENT_NAME = `${COMPONENT_PREFIX}Fieldset`;

/**
 * The default class name and classes prefix for this component.
 *
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const Fieldset: React.FC<IFieldsetProps> = ({
    className = '',
    children,
    legend,
    ...props
}: IFieldsetProps): React.ReactElement => (
    <fieldset className={classNames(className, CLASSNAME)} {...props}>
        {legend && <legend className={`${CLASSNAME}__legend`}>{legend}</legend>}
        {children}
    </fieldset>
);
Fieldset.displayName = COMPONENT_NAME;

export { CLASSNAME, Fieldset, IFieldsetProps };
