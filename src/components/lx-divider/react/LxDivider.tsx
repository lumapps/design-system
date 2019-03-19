import { Theme, Themes } from 'LumX/components';

/////////////////////////////

import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

import React from 'react';

import classNames from 'classnames';

import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = 'lx-divider';

/////////////////////////////

/**
 * Defines the props of the <LxDivider> component.
 */
interface ILxDividerProps extends IGenericProps {
    /**
     * The divider theme which must be defined by `lx-divider--${theme}` CSS class.
     */
    theme?: Theme;
}
type LxDividerProps = ILxDividerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxDividerDefaultPropsType {
    theme: Theme;
}

/**
 * The default value of props.
 *
 * @type {ILxDividerDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxDividerDefaultPropsType = {
    theme: Themes.light,
};
/**
 * Displays a divider.
 * This simply wraps a <hr> element.
 *
 * @return {JSX.Element} The <LxDivider> root component.
 */
const LxDivider: React.FC<LxDividerProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    ...props
}: LxDividerProps): JSX.Element => {
    return <hr className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props} />;
};
LxDivider.displayName = 'LxDivider';

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, LxDivider, LxDividerProps, Theme, Themes };
