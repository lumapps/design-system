import { ColorPalette, Size, Theme } from '../../constants';
import {
    HasTheme,
    HasAriaDisabled,
    JSXElement,
    LumxClassName,
    HasClassName,
    HasDisabled,
    CommonRef,
    GenericProps,
} from '../../types';
import { classNames, onEnterPressed } from '../../utils';

/**
 * Chip sizes.
 */
export type ChipSize = Extract<Size, 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ChipProps extends HasClassName, HasDisabled, HasTheme, HasAriaDisabled {
    /** A component to be rendered after the content. */
    after?: JSXElement;
    /** A component to be rendered before the content. */
    before?: JSXElement;
    /** Color variant. */
    color?: ColorPalette;
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the chip is currently in a highlighted state or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Size variant. */
    size?: ChipSize;
    /** href for the chip if it is a link */
    href?: string;
    /** reference to the root element */
    ref?: CommonRef;
    /** On "after" element clicked callback. */
    handleAfterClick?: (event?: any) => void;
    /** On element key down callback. */
    handleKeyDown?: (event?: any) => void;
    /** On "before" element clicked callback. */
    handleBeforeClick?: (event?: any) => void;
    /** On element clicked callback. */
    handleClick?: (event?: any) => void;
    /** name of the prop for handling key down events */
    keyDownProp?: string;
    /** name of the prop for tab index */
    tabIndexProp?: string;
    /** Children */
    children?: JSXElement;
    /** Props to apply when the component is in a disabled state. */
    disabledStateProps: GenericProps;
    /** Whether the "after" element has a click handler. */
    hasAfterClick?: boolean;
    /** Whether the "before" element has a click handler. */
    hasBeforeClick?: boolean;
    /** Whether the component has a main click handler. */
    hasOnClick?: boolean;
    /** Whether any part of the component is disabled. */
    isAnyDisabled?: boolean;
}

export type ChipPropsToOverride =
    | 'disabledStateProps'
    | 'hasOnClick'
    | 'hasBeforeClick'
    | 'hasAfterClick'
    | 'before'
    | 'after'
    | 'keyDownProp'
    | 'tabIndexProp'
    | 'isAnyDisabled';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Chip';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-chip';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ChipProps> = {
    size: Size.m,
};

/**
 * Chip component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Chip = (props: ChipProps) => {
    const {
        after,
        before,
        children,
        className,
        color,
        isClickable: propIsClickable,
        isHighlighted,
        isSelected,
        handleAfterClick,
        handleBeforeClick,
        handleClick,
        hasAfterClick,
        hasBeforeClick,
        hasOnClick,
        size = DEFAULT_PROPS.size,
        theme,
        ref,
        href,
        handleKeyDown,
        disabledStateProps,
        isAnyDisabled,
        keyDownProp = 'onKeyDown',
        tabIndexProp = 'tabIndex',
        ...forwardedProps
    } = props;
    const isButton = hasOnClick && !href;
    const isClickable = Boolean(hasOnClick) || Boolean(href) || propIsClickable;

    // Adapt color to the theme.
    const chipColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);

    const handleOnKeyDown = (evt: any) => {
        handleKeyDown?.(evt);

        if (hasOnClick && handleClick) {
            onEnterPressed(handleClick)(evt);
        }
    };

    const compatibilityProps = {
        [keyDownProp]: handleOnKeyDown,
        [tabIndexProp]: isClickable && !disabledStateProps.disabled ? 0 : undefined,
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <a
            role={isButton ? 'button' : undefined}
            {...compatibilityProps}
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
            onClick={hasOnClick ? handleClick : undefined}
        >
            {before && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={element('before', {
                        'is-clickable': hasBeforeClick,
                    })}
                    onClick={handleBeforeClick}
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
                    onClick={handleAfterClick}
                >
                    {after}
                </div>
            )}
        </a>
    );
};
