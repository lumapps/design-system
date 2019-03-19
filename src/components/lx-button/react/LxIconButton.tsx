import React, { Children, cloneElement, Fragment } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { LxIcon } from 'LumX';
import { isElementOfType, unwrapFragment } from 'LumX/core/react/utils';

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
} from './LxButton';

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

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxIconButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxIconButtonProps}  props The children and props of the <LxButton> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate({ children, variant }: LxIconButtonProps): React.ReactNode {
    const newChildren: React.ReactNode = unwrapFragment(children);

    const childrenCount: number = Children.count(newChildren);
    if (childrenCount === 0) {
        throw new Error('Your <LxIconButton> must have at least 1 child for the icon (got 0)!');
    }

    if (childrenCount > 1) {
        throw new Error(`You cannot have more than 1 child in a <LxIconButton> (got ${childrenCount})!`);
    }

    Children.forEach(
        newChildren,
        (child: any): void => {
            if (isElementOfType(child, LxIcon)) {
                return;
            }

            throw new Error(
                `You can only have a <LxIcon> child in a <LxIconButton> (got '${get(child.type, 'name', child.type) ||
                    `'${child}'`}')!`,
            );
        },
    );

    if (!isEmpty(variant)) {
        console.warn(
            `You shouldn't pass the 'variant' prop in a <LxIconButton> as it's forced to 'icon' (got '${variant}')!`,
        );
    }

    return newChildren;
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
                if (get(child.type, 'name') !== LxIcon.displayName) {
                    return <Fragment />;
                }

                return cloneElement(child, {
                    className: classNames(get(child.props, 'className', ''), CLASSNAME),
                });
            })}
        </LxButton>
    );
};
LxIconButton.displayName = 'LxIconButton';

/////////////////////////////

export {
    CLASSNAME,
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
