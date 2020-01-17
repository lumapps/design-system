import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IInputLabelProps extends IGenericProps {
    theme?: Theme;
    children: string | ReactNode;
}

interface IDefaultPropsType extends Partial<IInputLabelProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}InputLabel`;

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

const InputLabel: React.FC<IInputLabelProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    children,
    ...props
}: IInputLabelProps): ReactElement => (
    <label className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
        {children}
    </label>
);

InputLabel.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, InputLabel, IInputLabelProps };
