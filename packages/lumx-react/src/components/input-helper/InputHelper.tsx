import { Icon, Kind, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { INPUT_HELPER_CONFIGURATION } from './constants';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IInputHelperProps extends IGenericProps {
    children: string | ReactNode;
    kind?: Kind;
    theme?: Theme;
}

interface IDefaultPropsType extends Partial<IInputHelperProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}InputHelper`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    kind: Kind.info,
    theme: Theme.light,
};

const InputHelper: React.FC<IInputHelperProps> = ({
    children,
    className = '',
    kind = DEFAULT_PROPS.kind as Kind,
    theme = DEFAULT_PROPS.theme,
    ...props
}: IInputHelperProps): ReactElement => {
    const { color, icon } = INPUT_HELPER_CONFIGURATION[kind] || {};

    return (
        <span className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))} {...props}>
            {icon && <Icon icon={icon} size={Size.xxs} />}
            {children}
        </span>
    );
};

InputHelper.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, InputHelper, IInputHelperProps };
