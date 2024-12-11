import { ColorPalette, Size, Theme } from '@lumx/react';
import { useStopPropagation } from '@lumx/react/hooks/useStopPropagation';

import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { onEnterPressed } from '@lumx/react/utils/event';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';
import React, { forwardRef, MouseEventHandler, ReactNode } from 'react';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Chip sizes.
 */
type ChipSize = Extract<Size, 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ChipProps extends GenericProps, HasTheme {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** Color variant. */
    color?: ColorPalette;
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the chip is currently in a highlighted state or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Size variant. */
    size?: ChipSize;
    /** On "after" element clicked callback. */
    onAfterClick?: MouseEventHandler;
    /** On "before" element clicked callback. */
    onBeforeClick?: MouseEventHandler;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Chip';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ChipProps> = {
    size: Size.m,
};

/**
 * Chip component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Chip: Comp<ChipProps, HTMLAnchorElement> = forwardRef((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        after,
        before,
        children,
        className,
        color,
        disabled,
        isClickable: propIsClickable,
        isDisabled = disabled,
        isHighlighted,
        isSelected,
        onAfterClick,
        onBeforeClick,
        onClick,
        size,
        theme = defaultTheme,
        href,
        onKeyDown,
        ...forwardedProps
    } = props;
    const hasAfterClick = isFunction(onAfterClick);
    const hasBeforeClick = isFunction(onBeforeClick);
    const hasOnClick = isFunction(onClick);
    const isButton = hasOnClick && !href;
    const isClickable = Boolean(hasOnClick) || Boolean(href) || propIsClickable;

    // Adapt color to the theme.
    const chipColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    const handleOnBeforeClick = useStopPropagation(onBeforeClick);
    const handleOnAfterClick = useStopPropagation(onAfterClick);
    const handleKeyDown = (evt: React.KeyboardEvent) => {
        onKeyDown?.(evt);
        if (hasOnClick) {
            onEnterPressed(onClick)(evt);
        }
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <a
            role={isButton ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            {...forwardedProps}
            href={href}
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    clickable: isClickable,
                    color: chipColor,
                    isDisabled,
                    hasAfter: Boolean(after),
                    hasBefore: Boolean(before),
                    highlighted: Boolean(isHighlighted),
                    prefix: CLASSNAME,
                    selected: Boolean(isSelected),
                    size,
                    unselected: Boolean(!isSelected),
                }),
            )}
            aria-disabled={(isClickable && isDisabled) || undefined}
            onClick={hasOnClick ? onClick : undefined}
            onKeyDown={handleKeyDown}
        >
            {before && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={classNames(`${CLASSNAME}__before`, {
                        [`${CLASSNAME}__before--is-clickable`]: hasBeforeClick,
                    })}
                    onClick={handleOnBeforeClick}
                >
                    {before}
                </div>
            )}

            <div className={`${CLASSNAME}__label`}>{children}</div>

            {after && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={classNames(`${CLASSNAME}__after`, {
                        [`${CLASSNAME}__after--is-clickable`]: hasAfterClick,
                    })}
                    onClick={handleOnAfterClick}
                >
                    {after}
                </div>
            )}
        </a>
    );
});
Chip.displayName = COMPONENT_NAME;
Chip.className = CLASSNAME;
Chip.defaultProps = DEFAULT_PROPS;
