import React from 'react';

import classNames from 'classnames';

import { IconButton } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/react/utils';

import { Button, Color, Colors, Size, Sizes, Theme, Themes } from './Button';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps extends IGenericProps {}
type ButtonGroupProps = IProps;

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
function _validate(props: ButtonGroupProps): React.ReactNode {
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
    ...props
}: ButtonGroupProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children });

    return (
        <div className={classNames(className, CLASSNAME)} {...props}>
            {newChildren}
        </div>
    );
};
ButtonGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Color, Colors, ButtonGroup, ButtonGroupProps, Size, Sizes, Theme, Themes };
