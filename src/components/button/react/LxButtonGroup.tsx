import { IGenericProps, unwrapFragment } from 'LumX/react/utils';

/////////////////////////////

import React, { Children } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';

import { LxIconButton } from 'LumX';
import { isElementOfType } from 'LumX/core/react/utils';

import { CLASSNAME as LXBUTTON_CLASSNAME, Color, Colors, LxButton, Size, Sizes, Theme, Themes } from './LxButton';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps extends IGenericProps {}
type LxButtonGroupProps = IProps;

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
const CLASSNAME: string = `${LXBUTTON_CLASSNAME}-group`;

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxButtonGroup> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {IProps}  props The children and props of the <LxButtonGroup> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate({ children }: IProps): React.ReactNode {
    let newChildren: React.ReactNode = children;

    newChildren = unwrapFragment(newChildren);

    const childrenCount = Children.count(newChildren);
    if (childrenCount !== 2) {
        throw new Error(
            `Your <LxButtonGroup> must have exactly 2 children for the main button and the secondary button (got ${childrenCount})!`,
        );
    }

    Children.forEach(
        newChildren,
        (child: any): void => {
            if (isElementOfType(child, LxButton) || isElementOfType(child, LxIconButton)) {
                return;
            }

            throw new Error(
                `You can only have <${LxButton.displayName}>s or <${
                    LxIconButton.displayName
                } children in a <LxButtonGroup> (got '${get(child.type, 'name', child.type) || `'${child}'`}')!`,
            );
        },
    );

    return newChildren;
}

/////////////////////////////

/**
 * Displays a group of <LxButton>s.
 *
 * @see {@link LxButton} for more information on <LxButton>.
 *
 * @return {JSX.Element} The <LxButtonGroup> component.
 */
const LxButtonGroup: React.FC<IProps> = ({ children, className = '', ...props }: IProps): JSX.Element => {
    const newChildren = _validate({ children });

    return (
        <div className={classNames(className, CLASSNAME)} {...props}>
            {newChildren}
        </div>
    );
};
LxButtonGroup.displayName = 'LxButtonGroup';

/////////////////////////////

export { CLASSNAME, Color, Colors, LxButtonGroup, LxButtonGroupProps, Size, Sizes, Theme, Themes };
