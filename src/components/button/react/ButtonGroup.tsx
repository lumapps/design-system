import { IGenericProps, validateComponent } from 'LumX/react/utils';

/////////////////////////////

import React from 'react';

import classNames from 'classnames';

import { LxIconButton } from 'LumX';

import { CLASSNAME as LXBUTTON_CLASSNAME, Color, Colors, LxButton, Size, Sizes, Theme, Themes } from './Button';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps extends IGenericProps {}
type LxButtonGroupProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxButtonGroupDefaultPropsType extends Partial<LxButtonGroupProps> {}

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

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = 'LxButtonGroup';

/**
 * The default value of props.
 *
 * @type {ILxButtonGroupDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxButtonGroupDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxButtonGroup> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxButtonGroupProps} props The children and props of the <LxButtonGroup> component.
 * @return {React.ReactNode}    The processed children of the component.
 */
function _validate(props: LxButtonGroupProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        allowedTypes: [LxIconButton, LxButton],
        maxChildren: 2,
        minChildren: 2,
        props,
    });
}

/////////////////////////////

/**
 * Displays a group of <LxButton>s.
 *
 * @see {@link LxButton} for more information on <LxButton>.
 *
 * @return {JSX.Element} The <LxButtonGroup> component.
 */
const LxButtonGroup: React.FC<LxButtonGroupProps> = ({
    children,
    className = '',
    ...props
}: LxButtonGroupProps): JSX.Element => {
    const newChildren = _validate({ children });

    return (
        <div className={classNames(className, CLASSNAME)} {...props}>
            {newChildren}
        </div>
    );
};
LxButtonGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Color, Colors, LxButtonGroup, LxButtonGroupProps, Size, Sizes, Theme, Themes };
