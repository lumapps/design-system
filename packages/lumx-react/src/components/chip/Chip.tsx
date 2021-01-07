import { Color, ColorPalette, Size, Theme } from '@lumx/react';
import { useStopPropagation } from '@lumx/react/hooks/useStopPropagation';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';
import React, { forwardRef, MouseEventHandler, ReactNode } from 'react';

/**
 * Chip sizes.
 */
type ChipSize = Extract<Size, 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ChipProps extends GenericProps {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** Color variant. */
    color?: Color;
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
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
