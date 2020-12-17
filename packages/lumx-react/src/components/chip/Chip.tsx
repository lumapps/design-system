import { Color, ColorPalette, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { useStopPropagation } from '@lumx/react/hooks/useStopPropagation';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';
import React, { forwardRef, MouseEventHandler, ReactNode } from 'react';

/**
 * Authorized size values.
 */
type ChipSize = Size.s | Size.m;

/**
 * Defines the props of the component.
 */
export interface ChipProps extends GenericProps {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** The color variant of the component. */
    color?: Color;
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the chip is currently in a highlighted state or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** The size variant of the component. */
    size?: ChipSize;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The function called when the "after" element is clicked. */
    onAfterClick?: MouseEventHandler;
    /** The function called when the "before" element is clicked. */
    onBeforeClick?: MouseEventHandler;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Chip`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ChipProps> = {
    size: Size.m,
    theme: Theme.light,
};

/**
 * Chip component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Chip: Comp<ChipProps, HTMLAnchorElement> = forwardRef((props, ref) => {
    const {
        after,
        before,
        children,
        className,
        color,
        disabled,
        isClickable,
        isDisabled = disabled,
        isHighlighted,
        isSelected,
        onAfterClick,
        onBeforeClick,
        onClick,
        size,
        theme,
        useCustomColors,
        ...forwardedProps
    } = props;
    const hasAfterClick = isFunction(onAfterClick);
    const hasBeforeClick = isFunction(onBeforeClick);
    const hasOnClick = isFunction(onClick);

    // Adapt color to the theme.
    const chipColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    const handleOnBeforeClick = useStopPropagation(onBeforeClick);
    const handleOnAfterClick = useStopPropagation(onAfterClick);

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <a
            {...forwardedProps}
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    clickable: Boolean(hasOnClick) || isClickable,
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
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            role={hasOnClick ? 'button' : undefined}
            tabIndex={isDisabled || !hasOnClick ? -1 : 0}
            aria-disabled={(hasOnClick && isDisabled) || undefined}
            onClick={hasOnClick ? onClick : undefined}
            onKeyDown={hasOnClick ? onEnterPressed(onClick) : undefined}
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
