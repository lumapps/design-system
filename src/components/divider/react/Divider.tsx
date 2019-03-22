import React from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDividerProps extends IGenericProps {
    /**
     * The divider theme.
     */
    theme?: Theme;
}
type DividerProps = IDividerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<DividerProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Divider`;

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
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Themes.light,
};

/////////////////////////////

/**
 * Displays a divider.
 * This simply wraps a <hr> element.
 *
 * @return {JSX.Element} The component.
 */
const Divider: React.FC<DividerProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    ...props
}: DividerProps): JSX.Element => {
    return <hr className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props} />;
};
Divider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Divider, DividerProps, Theme, Themes };
