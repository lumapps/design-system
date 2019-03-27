import React, { Children, cloneElement } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { Icon } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';

import {
    Button,
    ButtonProps,
    CLASSNAME as BUTTON_CLASSNAME,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    Size,
    Sizes,
    Theme,
    Themes,
} from './Button';

/////////////////////////////

enum Variants {
    icon = 'icon',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends ButtonProps {
    /**
     * The <IconButton> should never have the `variant` prop as this prop is forced to 'icon' in the <Button>.
     */
    variant?: never;
}
type IconButtonProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IconButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}IconButton`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component before validating the children.
 *
 * @param {ValidateParameters} params The children, their number and the props of the component.
 */
function _preValidate({ props }: ValidateParameters): void {
    if (isEmpty(props.variant)) {
        return;
    }

    console.warn(
        `You shouldn't pass the \`variant\` prop in a <${COMPONENT_NAME}> as it's forced to 'icon' (got '${
            props.variant
        }')!`,
    );
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {IconButtonProps} props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: IconButtonProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        allowedTypes: [Icon],
        maxChildren: 1,
        minChildren: 1,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an icon button.
 * It's like a <Button> but only displays an icon instead of a label in the body of the button.
 *
 * Note that you cannot use the `variant` prop in this component.
 *
 * @see {@link Button} for more information on <Button>.
 *
 * @return {React.ReactElement} The component.
 */
const IconButton: React.FC<IconButtonProps> = ({
    children,
    className = '',
    ...props
}: IconButtonProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, ...props });

    return (
        <Button className={classNames(className, CLASSNAME)} {...props} variant={Variants.icon}>
            {Children.map(
                newChildren,
                // tslint:disable-next-line: no-any
                (child: any): React.ReactNode => {
                    return cloneElement(child, {
                        className: classNames(get(child.props, 'className', ''), `${BUTTON_CLASSNAME}__icon`),
                    });
                },
            )}
        </Button>
    );
};
IconButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    IconButton,
    IconButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
