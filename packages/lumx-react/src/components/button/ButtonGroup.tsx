import React, { Ref } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName } from '@lumx/react/utils';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface ButtonGroupProps extends GenericProps {
    /** Ref passed to the wrapper. */
    buttonGroupRef?: Ref<HTMLDivElement>;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ButtonGroupProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: DefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/////////////////////////////

/**
 * Displays a group of <Button>s.
 *
 * @see {@link Button} for more information on <Button>.
 *
 * @return The component.
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '', buttonGroupRef, ...props }) => (
    <div className={classNames(className, CLASSNAME)} ref={buttonGroupRef} {...props}>
        {children}
    </div>
);
ButtonGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ButtonGroup, ButtonGroupProps };
