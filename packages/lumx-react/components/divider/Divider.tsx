import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { Theme } from 'LumX';
import { COMPONENT_PREFIX } from '@lumx/core/react/constants';
import { handleBasicClasses } from '@lumx/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDividerProps extends IGenericProps {
    /**
     * The <Divider> theme.
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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Divider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Theme.light,
};

/////////////////////////////

/**
 * Displays a divider.
 * This simply wraps a <hr> element.
 *
 * @return The component.
 */
const Divider: React.FC<DividerProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    ...props
}: DividerProps): ReactElement => {
    return <hr className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props} />;
};
Divider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Divider, DividerProps };
