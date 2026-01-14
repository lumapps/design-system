import { MouseEventHandler, ReactNode } from 'react';

import isFunction from 'lodash/isFunction';

import { ColorPalette, Size, Theme } from '@lumx/react';
import { useStopPropagation } from '@lumx/react/hooks/useStopPropagation';

import { GenericProps, HasTheme, HasAriaDisabled } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames, onEnterPressed } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

/**
 * Chip sizes.
 */
type ChipSize = Extract<Size, 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ChipProps extends GenericProps, HasTheme, HasAriaDisabled {
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
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Chip';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-chip';
const { block, element } = classNames.bem(CLASSNAME);

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
export const Chip = forwardRef<ChipProps, HTMLAnchorElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        after,
        before,
        children,
        className,
        color,
        isClickable: propIsClickable,
        isHighlighted,
        isSelected,
        onAfterClick,
        onBeforeClick,
        onClick,
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        href,
        onKeyDown,
        ...forwardedProps
    } = otherProps;
    const hasAfterClick = isFunction(onAfterClick);
    const hasBeforeClick = isFunction(onBeforeClick);
    const hasOnClick = isFunction(props.onClick);
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
            tabIndex={isClickable && !disabledStateProps.disabled ? 0 : undefined}
            {...forwardedProps}
            href={!disabledStateProps.disabled ? href : undefined}
            ref={ref}
            className={classNames.join(
                className,
                block({
                    'is-clickable': isClickable,
                    [`color-${chipColor}`]: Boolean(chipColor),
                    'is-disabled': isAnyDisabled,
                    'has-after': Boolean(after),
                    'has-before': Boolean(before),
                    'is-highlighted': Boolean(isHighlighted),
                    'is-selected': Boolean(isSelected),
                    [`size-${size}`]: Boolean(size),
                    'is-unselected': Boolean(!isSelected),
                }),
            )}
            aria-disabled={(isClickable && isAnyDisabled) || undefined}
            onClick={hasOnClick ? onClick : undefined}
            onKeyDown={handleKeyDown}
        >
            {before && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={element('before', {
                        'is-clickable': hasBeforeClick,
                    })}
                    onClick={handleOnBeforeClick}
                >
                    {before}
                </div>
            )}
            <div className={element('label')}>{children}</div>
            {after && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={element('after', {
                        'is-clickable': hasAfterClick,
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
