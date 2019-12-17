import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from '@lumx/core/js/constants';
import { Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface IFieldsetProps extends IGenericProps {
    legend?: ReactElement | string;
    topSpacing?: Size;
    bottomSpacing?: Size;
    theme?: Theme;
}

interface IDefaultPropsType extends Partial<IFieldsetProps> {}
const FIELDSET_DEFAULT_PROPS: IDefaultPropsType = {
    bottomSpacing: Size.big,
    theme: Theme.light,
    topSpacing: Size.huge,
};

const COMPONENT_NAME = `${COMPONENT_PREFIX}Fieldset`;

/**
 * The default class name and classes prefix for this component.
 *
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const Fieldset: React.FC<IFieldsetProps> = ({
    bottomSpacing = FIELDSET_DEFAULT_PROPS.bottomSpacing,
    className = '',
    children,
    legend,
    theme = FIELDSET_DEFAULT_PROPS.theme,
    topSpacing = FIELDSET_DEFAULT_PROPS.topSpacing,
    ...props
}: IFieldsetProps): React.ReactElement => (
    <fieldset className={classNames(className, CLASSNAME, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
        {legend && (
            <legend
                className={classNames(
                    `${CSS_PREFIX}-spacing-margin-bottom-${bottomSpacing}`,
                    `${CSS_PREFIX}-spacing-margin-top-${topSpacing}`,
                )}
            >
                {legend}
            </legend>
        )}
        {children}
    </fieldset>
);
Fieldset.displayName = COMPONENT_NAME;

export { CLASSNAME, FIELDSET_DEFAULT_PROPS, Fieldset, IFieldsetProps };
