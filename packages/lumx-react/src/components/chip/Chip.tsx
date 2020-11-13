import React, { MouseEventHandler, ReactNode, Ref, useCallback } from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Color, ColorPalette, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';

import { GenericProps, ValueOf, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
type ChipSize = Size.s | Size.m;

/**
 * Defines the props of the component.
 */
interface ChipProps extends GenericProps {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** The reference passed to the <a> element. */
    chipRef?: Ref<HTMLAnchorElement>;
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
    size?: ValueOf<ChipSize>;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ChipProps> = {
    size: Size.m,
    theme: Theme.light,
};

/**
 * Wrap mouse event handler to stop event propagation.
 *
 * @param  handler   The mouse handler to wrap.
 * @return Mouse handler stopping propagation.
 */
function useStopPropagation(handler?: MouseEventHandler): MouseEventHandler {
    return useCallback(
        (evt) => {
            if (!evt || !isFunction(handler)) {
                return;
            }
            handler(evt);
            evt.stopPropagation();
        },
        [handler],
    );
}

const Chip: React.FC<ChipProps> = ({
    after,
    before,
    children,
    chipRef,
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
}) => {
    const hasAfterClick = isFunction(onAfterClick);
    const hasBeforeClick = isFunction(onBeforeClick);
    const hasOnClick = isFunction(onClick);

    // Adapt color to the theme.
    const chipColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    const handleOnBeforeClick = useStopPropagation(onBeforeClick);
    const handleOnAfterClick = useStopPropagation(onAfterClick);

    return (
        <a
            {...forwardedProps}
            ref={chipRef}
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
};

Chip.displayName = COMPONENT_NAME;
Chip.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Chip, ChipProps };
