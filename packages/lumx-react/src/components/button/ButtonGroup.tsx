import React, { Ref } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName } from '@lumx/react/utils';
/**
 * Defines the props of the component
 */
interface ButtonGroupProps extends GenericProps {
    /** Ref passed to the wrapper. */
    buttonGroupRef?: Ref<HTMLDivElement>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ButtonGroupProps> = {};

/**
 * Displays a group of <Button>s.
 *
 * @see {@link Button} for more information on <Button>.
 *
 * @return The component.
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className, buttonGroupRef, ...forwardedProps }) => (
    <div {...forwardedProps} className={classNames(className, CLASSNAME)} ref={buttonGroupRef}>
        {children}
    </div>
);
ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, ButtonGroup, ButtonGroupProps };
