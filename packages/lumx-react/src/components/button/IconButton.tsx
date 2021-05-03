import React, { forwardRef } from 'react';

import { Emphasis, Icon, Size, Theme, Tooltip, TooltipProps } from '@lumx/react';
import { BaseButtonProps, ButtonRoot } from '@lumx/react/components/button/ButtonRoot';
import { Comp, getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface IconButtonProps extends BaseButtonProps {
    /** Icon (SVG path). */
    icon: string;
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
    theme: Theme.light,
};

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const IconButton: Comp<IconButtonProps, HTMLButtonElement> = forwardRef((props, ref) => {
    const { emphasis, icon, label, size, theme, tooltipProps, hideTooltip, ...forwardedProps } = props;

    return (
        <Tooltip label={hideTooltip ? '' : label} {...tooltipProps}>
            <ButtonRoot ref={ref} {...{ emphasis, size, theme, ...forwardedProps }} aria-label={label} variant="icon">
                <Icon icon={icon} />
            </ButtonRoot>
        </Tooltip>
    );
});
IconButton.displayName = COMPONENT_NAME;
IconButton.className = CLASSNAME;
IconButton.defaultProps = DEFAULT_PROPS;
