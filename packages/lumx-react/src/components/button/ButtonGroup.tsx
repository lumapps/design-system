import React, { ReactElement, ReactNode, Ref } from 'react';

import classNames from 'classnames';

import { IconButton } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from '@lumx/react/utils';

import { Button } from './Button';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IButtonGroupProps extends IGenericProps {
    /** Ref passed to the wrapper. */
    buttonGroupRef?: Ref<HTMLDivElement>;
}
type ButtonGroupProps = IButtonGroupProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ButtonGroupProps> {}

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
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param props The children and props of the component.
 * @return    The processed children of the component.
 */
function _validate(props: ButtonGroupProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        allowedTypes: [IconButton, Button],
        maxChildren: 2,
        minChildren: 2,
        props,
    });
}

/////////////////////////////

/**
 * Displays a group of <Button>s.
 *
 * @see {@link Button} for more information on <Button>.
 *
 * @return The component.
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
    children,
    className = '',
    buttonGroupRef,
    ...props
}: ButtonGroupProps): ReactElement => {
    const newChildren: ReactNode = _validate({ children });

    return (
        <div className={classNames(className, CLASSNAME)} ref={buttonGroupRef} {...props}>
            {newChildren}
        </div>
    );
};
ButtonGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ButtonGroup, ButtonGroupProps };
