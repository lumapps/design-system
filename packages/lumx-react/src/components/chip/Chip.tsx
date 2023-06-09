import React, { forwardRef, MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';

import { ColorPalette, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

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
    /**
     * Whether the component is clickable or not.
     * @deprecated using `onClick` or `href` automatically make the chip clickable.
     */
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
    theme: Theme.light,
};

const switchComponent = (baseComponent: React.ElementType | null, { isDisabled, onClick, href, target, rel }: any) => {
    if (!baseComponent) return [];

    const componentProps: any = {};
    let Component = baseComponent;
    if (onClick) {
        Component = 'button';
        componentProps.type = 'button';
        if (!isDisabled) {
            componentProps.onClick = onClick;
        }
    }
    if (href) {
        Component = 'a';
        if (!isDisabled) {
            componentProps.href = href;
        }
        componentProps.target = target;
        componentProps.rel = rel;
    }
    if (isDisabled) componentProps['aria-disabled'] = isDisabled;

    return [Component, componentProps];
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
        isClickable: propIsClickable,
        isDisabled = disabled,
        isHighlighted,
        isSelected,
        onAfterClick,
        onBeforeClick,
        onClick,
        size,
        theme,
        href,
        target,
        rel,
        ...forwardedProps
    } = props;

    // Adapt color to the theme.
    const chipColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    const [Label, labelProps] = switchComponent('span', { isDisabled, onClick, href, target, rel });
    const [Before, beforeProps] = switchComponent(before ? 'span' : null, { isDisabled, onClick: onBeforeClick });
    const [After, afterProps] = switchComponent(after ? 'span' : null, { isDisabled, onClick: onAfterClick });

    const isClickable = Label === 'button' || Label === 'a' || propIsClickable;
    const isAfterClickable = after && !!onAfterClick;
    const isBeforeClickable = before && !!onBeforeClick;

    return (
        <span
            {...forwardedProps}
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    clickable: isClickable,
                    isAfterClickable,
                    isBeforeClickable,
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
        >
            {isBeforeClickable && Before && (
                <Before {...beforeProps} className={`${CLASSNAME}__before ${CLASSNAME}__before--is-clickable`}>
                    {before}
                </Before>
            )}

            <Label
                {...labelProps}
                className={classNames(`${CLASSNAME}__label`, {
                    [`${CLASSNAME}__label--is-clickable`]: isClickable,
                })}
            >
                {before && !isBeforeClickable && <span className={`${CLASSNAME}__before`}>{before}</span>}
                {children}
                {after && !isAfterClickable && <span className={`${CLASSNAME}__after`}>{after}</span>}
            </Label>

            {!!onAfterClick && After && (
                <After {...afterProps} className={`${CLASSNAME}__after ${CLASSNAME}__after--is-clickable`}>
                    {after}
                </After>
            )}
        </span>
    );
});
Chip.displayName = COMPONENT_NAME;
Chip.className = CLASSNAME;
Chip.defaultProps = DEFAULT_PROPS;
