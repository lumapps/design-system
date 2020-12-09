import React, { Ref } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component
 */
export interface ButtonGroupProps extends GenericProps {
    /** The reference passed to the wrapper. */
    buttonGroupRef?: Ref<HTMLDivElement>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ButtonGroupProps> = {};

export const ButtonGroup: Comp<ButtonGroupProps> = ({ buttonGroupRef, children, className, ...forwardedProps }) => (
    <div {...forwardedProps} className={classNames(className, CLASSNAME)} ref={buttonGroupRef}>
        {children}
    </div>
);
ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
