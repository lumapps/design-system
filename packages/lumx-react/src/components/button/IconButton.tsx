import React, { forwardRef } from 'react';

import { Emphasis, Icon, Size, Theme, Tooltip, TooltipProps } from '@lumx/react';
import { BaseButtonProps, ButtonRoot } from '@lumx/react/components/button/ButtonRoot';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface IconButtonProps extends BaseButtonProps {
    /**
     * The icon name to use as the button label.
     * @see {@link IconProps#icon}
     */
    icon: string;
    /**
     * The label of the tooltip. It is required for a11y purpose.
     * If you really don't want a tooltip and aria-label, you can give an empty label (this is not recommended).
     */
    label: string;
    /** The props to pass to the tooltip, minus those already set by the IconButton props. */
    tooltipProps?: Omit<TooltipProps, 'label'>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}IconButton`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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
    const { emphasis, icon, label, size, theme, tooltipProps, ...forwardedProps } = props;

    return (
        <Tooltip label={label} {...tooltipProps}>
            <ButtonRoot ref={ref} {...{ emphasis, size, theme, ...forwardedProps }} aria-label={label} variant="icon">
                <Icon icon={icon} />
            </ButtonRoot>
        </Tooltip>
    );
});
IconButton.displayName = COMPONENT_NAME;
IconButton.className = CLASSNAME;
IconButton.defaultProps = DEFAULT_PROPS;
