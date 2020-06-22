import React, { MouseEventHandler, ReactNode, Ref, useCallback } from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Color, ColorPalette, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
type ChipSize = Size.s | Size.m;

/**
 * Defines the props of the component.
 */
interface ChipProps extends GenericProps {
    /** A component to be rendered after the main label area. */
    after?: ReactNode;
    /** A component to be rendered before the main label area. */
    before?: ReactNode;
    /** The component color variant. */
    color?: Color;
    /** Whether the chip has pointer on hover. */
    isClickable?: boolean;
    /** Indicates if the chip is currently in an active state or not. */
    isSelected?: boolean;
    /** Indicates if the chip is currently disabled or not. */
    isDisabled?: boolean;
    /** Indicates if the chip is currently in a highlighted state or not. */
    isHighlighted?: boolean;
    /** The size of the chip. */
    size?: ChipSize;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
    /** A ref that will be passed to the wrapper element. */
    chipRef?: Ref<HTMLAnchorElement>;
    /** A function to be executed when the after element is clicked. */
    onAfterClick?: MouseEventHandler;
    /** A function to be executed when the before element is clicked. */
    onBeforeClick?: MouseEventHandler;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ChipProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    isClickable: false,
    isDisabled: false,
    isHighlighted: false,
    isSelected: false,
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

/**
 * Displays information or allow an action on a compact element.
 * This is the base component for all variations of the chips see https://material.io/design/components/chips.html.
 *
 * @return The Chip component.
 */
const Chip: React.FC<ChipProps> = ({
    after = DEFAULT_PROPS.after,
    before = DEFAULT_PROPS.before,
    className,
    children,
    color,
    isClickable = DEFAULT_PROPS.isClickable,
    isSelected = DEFAULT_PROPS.isSelected,
    isDisabled = DEFAULT_PROPS.isDisabled,
    isHighlighted = DEFAULT_PROPS.isHighlighted,
    onAfterClick,
    onBeforeClick,
    onClick,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    chipRef,
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
                    disabled: Boolean(isDisabled),
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
            role="button"
            tabIndex={isDisabled || !hasOnClick ? -1 : 0}
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

export { CLASSNAME, DEFAULT_PROPS, Chip, ChipProps };
