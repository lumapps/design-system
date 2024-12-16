import React from 'react';

import { Emphasis, Icon, Size, Theme, Tooltip, TooltipProps } from '@lumx/react';
import { BaseButtonProps, ButtonRoot } from '@lumx/react/components/button/ButtonRoot';
import { getRootClassName } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface IconButtonProps extends BaseButtonProps {
    /**
     * Icon (SVG path).
     * If `image` is also set, `image` will be used instead.
     */
    icon?: string;
    /**
     * Image (image url).
     * Has priority over `icon`.
     */
    image?: string;
    /**
     * Label text (required for a11y purpose).
     * If you really don't want an aria-label, you can set an empty label (this is not recommended).
     */
    label: string;
    /**
     * Props to pass to the tooltip.
     * If undefined or if tooltipProps.label is undefined, the label prop will be used as tooltip label.
     * */
    tooltipProps?: Partial<TooltipProps>;
    /** Whether the tooltip should be hidden or not. */
    hideTooltip?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'IconButton';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<IconButtonProps> = {
    emphasis: Emphasis.high,
    size: Size.m,
};

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const IconButton = forwardRef<IconButtonProps, HTMLButtonElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        emphasis,
        image,
        icon,
        label,
        size,
        theme = defaultTheme,
        tooltipProps,
        hideTooltip,
        ...forwardedProps
    } = props;

    return (
        <Tooltip label={hideTooltip ? '' : label} {...tooltipProps}>
            <ButtonRoot ref={ref} {...{ emphasis, size, theme, ...forwardedProps }} aria-label={label} variant="icon">
                {image ? (
                    <img
                        // no need to set alt as an aria-label is already set on the button
                        alt=""
                        src={image}
                    />
                ) : (
                    <Icon icon={icon as string} />
                )}
            </ButtonRoot>
        </Tooltip>
    );
});
IconButton.displayName = COMPONENT_NAME;
IconButton.className = CLASSNAME;
IconButton.defaultProps = DEFAULT_PROPS;
