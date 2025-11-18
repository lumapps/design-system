import React from 'react';

import classNames from 'classnames';

import { ColorPalette, Icon, Size, Theme, Text } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface FlagProps extends GenericProps, HasTheme {
    /** Color of the component. */
    color?: ColorPalette;
    /** Icon to use before the label. */
    icon?: string;
    /** Text label of the flag. */
    label: React.ReactNode;
    /** Enable text truncate on overflow */
    truncate?: boolean;
}

const COMPONENT_NAME = 'Flag';
const CLASSNAME = getRootClassName(COMPONENT_NAME);
const DEFAULT_PROPS: Partial<FlagProps> = {};

/**
 * Flag component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Flag = forwardRef<FlagProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { label, icon, color, className, theme = defaultTheme, truncate, ...forwardedProps } = props;
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);
    const isTruncated = !!truncate;

    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color: flagColor, isTruncated }))}
            ref={ref}
        >
            {icon && <Icon icon={icon} size={Size.xxs} className={`${CLASSNAME}__icon`} />}
            <Text as="span" truncate={isTruncated} typography="overline" className={`${CLASSNAME}__label`}>
                {label}
            </Text>
        </div>
    );
});
Flag.displayName = COMPONENT_NAME;
Flag.className = CLASSNAME;
Flag.defaultProps = DEFAULT_PROPS;
