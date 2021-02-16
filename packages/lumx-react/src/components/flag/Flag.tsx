import React from 'react';
import classNames from 'classnames';

import { Theme, ColorPalette, Icon } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { ColorVariant } from '..';

export interface FlagProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** The color of the component */
    color?: ColorPalette;
    /** icon */
    icon?: string;
    /** label of the flag */
    label: string;
}

const COMPONENT_NAME = 'Flag';
export const CLASSNAME = getRootClassName(COMPONENT_NAME);
const DEFAULT_PROPS: Partial<FlagProps> = {
    theme: Theme.light,
};

/**
 * Flag component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const Flag: React.FC<FlagProps> = ({ label, icon, color, className, theme }) => {
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    return (
        <span className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color: flagColor }))}>
            {icon && <Icon icon={icon} color={color} colorVariant={ColorVariant.D2} className={`${CLASSNAME}__icon`} />}
            {label}
        </span>
    );
};
Flag.displayName = COMPONENT_NAME;
Flag.defaultProps = DEFAULT_PROPS;
