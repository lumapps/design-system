import { ColorPalette, Emphasis, Size, Theme } from '../../constants';
import { classNames } from '../../utils';
import { HasTheme, HasAriaDisabled, AriaAttributes, CommonRef, HasClassName } from '../../types';
import { RawClickable, BaseClickableProps } from '../RawClickable';

/**
 * Button size definition.
 */
export type ButtonSize = Extract<Size, 's' | 'm'>;

export interface BaseButtonProps
    extends Pick<AriaAttributes, 'aria-expanded' | 'aria-haspopup' | 'aria-pressed' | 'aria-label'>,
        HasClassName,
        HasTheme,
        HasAriaDisabled,
        BaseClickableProps {
    /** Color variant. */
    color?: ColorPalette;
    /** Emphasis variant. */
    emphasis?: Emphasis;
    /** Whether or not the button has a background color in low emphasis. */
    hasBackground?: boolean;
    /** Native anchor href property. It determines whether the Button will be a <button> or an <a>. */
    href?: string;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not (unsupported in `high` emphasis). */
    isSelected?: boolean;
    /** Native button name property. */
    name?: string;
    /** Size variant. */
    size?: ButtonSize;
    /** Native anchor target property. */
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** Native button type. */
    type?: 'submit' | 'reset' | 'button' | undefined;
    /** Custom component for the link (can be used to inject router Link). */
    linkAs?: 'a' | any;
    /** whether the button is dispalyed in full width or not */
    fullWidth?: boolean;
    /** whether the button is currently active or not */
    isActive?: boolean;
    /** whether the button is currently focused or not */
    isFocused?: boolean;
    /** whether the button is currently focused or not */
    isHovered?: boolean;
}

export interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonRoot';

export const BUTTON_WRAPPER_CLASSNAME = `lumx-button-wrapper`;
const { block: buttonWrapperBlock } = classNames.bem(BUTTON_WRAPPER_CLASSNAME);

export const BUTTON_CLASSNAME = `lumx-button`;
const { block: buttonBlock } = classNames.bem(BUTTON_CLASSNAME);

/**
 * Render a button wrapper with the ButtonRoot inside.
 *
 * @param  props Component props.
 * @return JSX element.
 */
const renderButtonWrapper = (props: ButtonRootProps) => {
    const { color, emphasis, variant, fullWidth } = props;

    const adaptedColor =
        emphasis === Emphasis.low && (color === ColorPalette.light ? ColorPalette.dark : ColorPalette.light);

    const wrapperClassName = buttonWrapperBlock({
        [`color-${adaptedColor}`]: Boolean(adaptedColor),
        [`variant-${variant}`]: Boolean(variant),
        'is-full-width': fullWidth,
    });
    const buttonProps = { ...props, hasBackground: false };

    return (
        <div className={wrapperClassName}>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            {ButtonRoot(buttonProps)}
        </div>
    );
};

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @return JSX Element.
 */
export const ButtonRoot = (props: ButtonRootProps) => {
    const {
        'aria-label': ariaLabel,
        'aria-disabled': ariaDisabled,
        children,
        className,
        color,
        emphasis,
        hasBackground,
        isSelected,
        isActive,
        isFocused,
        isHovered,
        linkAs,
        size,
        theme = Theme.light,
        variant,
        fullWidth,
        ref,
        ...forwardedProps
    } = props;

    const adaptedColor =
        color ||
        (emphasis !== Emphasis.high && theme === Theme.dark && ColorPalette.light) ||
        (emphasis === Emphasis.high && ColorPalette.primary) ||
        ColorPalette.dark;

    if (hasBackground) {
        return renderButtonWrapper({ ...props, ref, variant, color: adaptedColor });
    }

    const buttonClassName = classNames.join(
        className,
        buttonBlock({
            [`color-${adaptedColor}`]: Boolean(adaptedColor),
            [`emphasis-${emphasis}`]: Boolean(emphasis),
            'is-selected': isSelected,
            'is-disabled': Boolean(props.isDisabled || props['aria-disabled']),
            'is-active': isActive,
            'is-focused': isFocused,
            'is-hovered': isHovered,
            [`size-${size}`]: Boolean(size),
            [`theme-${theme}`]: Boolean(emphasis === Emphasis.high && theme),
            [`variant-${variant}`]: Boolean(variant),
            'is-full-width': fullWidth,
        }),
    );

    return RawClickable({
        as: linkAs || (forwardedProps.href ? 'a' : 'button'),
        ...forwardedProps,
        'aria-disabled': ariaDisabled,
        'aria-label': ariaLabel,
        ref: ref as CommonRef,
        className: buttonClassName,
        children,
    });
};
ButtonRoot.displayName = COMPONENT_NAME;
ButtonRoot.defaultProps = {};
