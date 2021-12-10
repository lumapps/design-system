import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { ColorPalette, ColorVariant, Icon, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

export interface FlagProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Color of the component. */
    color?: ColorPalette;
    /** Icon to use before the label. */
    icon?: string;
    /** Text label of the flag. */
    label: string;
}

const COMPONENT_NAME = 'Flag';
const CLASSNAME = getRootClassName(COMPONENT_NAME);
const DEFAULT_PROPS: Partial<FlagProps> = {
    theme: Theme.light,
};

/**
 * Flag component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Flag: Comp<FlagProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { label, icon, color, className, theme, ...forwardedProps } = props;
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color: flagColor }))}
            ref={ref}
        >
            {icon && (
                <Icon
                    icon={icon}
                    color={color}
                    colorVariant={ColorVariant.D2}
                    size={Size.xxs}
                    className={`${CLASSNAME}__icon`}
                />
            )}
            <span className={`${CLASSNAME}__label`}>{label}</span>
        </div>
    );
});
Flag.displayName = COMPONENT_NAME;
Flag.className = CLASSNAME;
Flag.defaultProps = DEFAULT_PROPS;
