import { AriaAttributes, ButtonHTMLAttributes, DetailedHTMLProps, RefObject } from 'react';

import { ColorPalette, Emphasis, Size, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { HasAriaDisabled } from '@lumx/react/utils/type/HasAriaDisabled';
import { RawClickable } from '@lumx/react/utils/react/RawClickable';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

type HTMLButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Button size definition.
 */
export type ButtonSize = Extract<Size, 's' | 'm'>;

export interface BaseButtonProps
    extends GenericProps,
        Pick<AriaAttributes, 'aria-expanded' | 'aria-haspopup' | 'aria-pressed' | 'aria-label'>,
        HasTheme,
        HasAriaDisabled {
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
    type?: HTMLButtonProps['type'];
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
}

export interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonRoot';

export const BUTTON_WRAPPER_CLASSNAME = `lumx-button-wrapper`;
export const BUTTON_CLASSNAME = `lumx-button`;

const wrapperBlock = classNames.bem.block(BUTTON_WRAPPER_CLASSNAME);

/**
 * Render a button wrapper with the ButtonRoot inside.
 *
 * @param  props Component props.
 * @return React element.
 */
const renderButtonWrapper: React.FC<ButtonRootProps> = (props) => {
    const { color, emphasis, variant, fullWidth } = props;

    const adaptedColor =
        emphasis === Emphasis.low && (color === ColorPalette.light ? ColorPalette.dark : ColorPalette.light);

    const wrapperClassName = wrapperBlock({
        [`color-${adaptedColor}`]: Boolean(adaptedColor),
        [`variant-${variant}`]: Boolean(variant),
        'is-full-width': fullWidth,
    });
    const buttonProps = { ...props, hasBackground: false };

    return (
        <div className={wrapperClassName}>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <ButtonRoot {...buttonProps} />
        </div>
    );
};

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot = forwardRef<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        'aria-label': ariaLabel,
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
        theme,
        variant,
        fullWidth,
        ...forwardedProps
    } = otherProps;
    const { block } = useClassnames(BUTTON_CLASSNAME);

    const adaptedColor =
        color ||
        (emphasis !== Emphasis.high && theme === Theme.dark && ColorPalette.light) ||
        (emphasis === Emphasis.high && ColorPalette.primary) ||
        ColorPalette.dark;

    if (hasBackground) {
        return renderButtonWrapper({ ...props, ref, variant, color: adaptedColor });
    }

    const buttonClassName = block(
        {
            [`color-${adaptedColor}`]: Boolean(adaptedColor),
            [`emphasis-${emphasis}`]: Boolean(emphasis),
            'is-selected': Boolean(isSelected),
            'is-disabled': Boolean(props.isDisabled || props['aria-disabled']),
            'is-active': Boolean(isActive),
            'is-focused': Boolean(isFocused),
            'is-hovered': Boolean(isHovered),
            [`size-${size}`]: Boolean(size),
            [`theme-${theme}`]: Boolean(emphasis === Emphasis.high && theme),
            [`variant-${variant}`]: Boolean(variant),
            'is-full-width': Boolean(fullWidth),
        },
        className,
    );

    return (
        <RawClickable
            as={linkAs || (forwardedProps.href ? 'a' : 'button')}
            {...forwardedProps}
            {...disabledStateProps}
            aria-disabled={isAnyDisabled}
            aria-label={ariaLabel}
            ref={ref as RefObject<HTMLButtonElement>}
            className={buttonClassName}
        >
            {children}
        </RawClickable>
    );
});
ButtonRoot.displayName = COMPONENT_NAME;
ButtonRoot.defaultProps = {};
