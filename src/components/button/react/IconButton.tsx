import React, { Children, cloneElement } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { LxIcon } from 'LumX';
import { validateComponent, ValidateParameters } from 'LumX/core/react/utils';

import {
    CLASSNAME as LXBUTTON_CLASSNAME,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    LxButton,
    LxButtonProps,
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
interface IProps extends LxButtonProps {
    /**
     * The <LxIconButton> should never have the `variant` prop as this prop is forced to 'icon' in the <LxButton>.
     */
    variant?: never;
}
type LxIconButtonProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxIconButtonDefaultPropsType extends Partial<LxIconButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${LXBUTTON_CLASSNAME}__icon`;

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = 'LxIconButton';

/**
 * The default value of props.
 *
 * @type {ILxIconButtonDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxIconButtonDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the <LxDropdownButton> component before validating the children.
 *
 * @param {ValidateParameters} props The properties of the component.
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
 * Validate the <LxIconButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxIconButtonProps} props The children and props of the <LxButton> component.
 * @return {React.ReactNode}   The processed children of the component.
 */
function _validate(props: LxIconButtonProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        allowedTypes: [LxIcon],
        maxChildren: 1,
        minChildren: 1,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an icon button.
 * It's like a <LxButton> but displays an icon instead of a label in the body of the button.
 *
 * Note that you cannot use the `variant` prop in this component.
 *
 * @see {@link LxButton} for more information on <LxButton>.
 *
 * @return {JSX.Element} The <LxIconButton> component.
 */
const LxIconButton: React.FC<LxIconButtonProps> = ({ children, ...props }: LxIconButtonProps): JSX.Element => {
    children = _validate({ children, ...props });

    return (
        <LxButton {...props} variant={Variants.icon}>
            {/* [XXX] Clement: Type of `child` should be React.ReactElement<LxIconProps>, but I didn't managed to make it work. */}
            {Children.map(children, (child: any) => {
                return cloneElement(child, {
                    className: classNames(get(child.props, 'className', ''), CLASSNAME),
                });
            })}
        </LxButton>
    );
};
LxIconButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    LxIconButton,
    LxIconButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
