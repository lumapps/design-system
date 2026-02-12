import { resolveColorWithVariants } from '@lumx/core/js/utils/_internal/color';
import { ColorVariant, ColorWithVariants, Typography } from '@lumx/core/js/constants';
import type {
    JSXElement,
    LumxClassName,
    HasTheme,
    HasClassName,
    CommonRef,
    HasAriaDisabled,
    HasDisabled,
} from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';

/**
 * Defines the props of the component.
 */
export interface LinkProps extends HasTheme, HasClassName, HasAriaDisabled, HasDisabled {
    /** Link label content. */
    label?: JSXElement;
    /** Color variant. */
    color?: ColorWithVariants;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: string;
    /**
     * Left icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the label
     */
    leftIcon?: string;
    /** Element type or custom component for the link. */
    as?: string | any;
    /**
     * Right icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the label
     */
    rightIcon?: string;
    /** Link target. */
    target?: string;
    /** Typography variant. */
    typography?: string;
    /** Click handler. */
    onClick?: (event: any) => void;
    /** Reference to the root element. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Link';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-link';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<LinkProps> = {};

/**
 * Link component (Core UI).
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Link = (props: LinkProps) => {
    const {
        label,
        className,
        color: propColor,
        colorVariant: propColorVariant,
        leftIcon,
        rightIcon,
        typography,
        as,
        ref,
        isDisabled,
        theme,
        href,
        target,
        onClick,
        ...forwardedProps
    } = props;

    const [color, colorVariant] = resolveColorWithVariants(propColor, propColorVariant);

    // Determine element type
    const ElementType = as || (href ? 'a' : 'button');

    // Build disabled props
    const disabledProps: any = {};
    if (isDisabled) {
        if (ElementType === 'button' || (!href && !as)) {
            disabledProps.disabled = true;
        } else {
            disabledProps['aria-disabled'] = true;
            disabledProps.tabIndex = -1;
        }
    }

    // Build class name
    const combinedClassName = classNames.join(
        className,
        block({
            [`color-${color}`]: Boolean(color),
            [`color-variant-${colorVariant}`]: Boolean(colorVariant),
            'has-typography': !!typography,
        }),
        typography && classNames.typography(typography as Typography),
    );

    // Build content with proper spacing for icons
    const content = (
        <>
            {leftIcon && <> {Icon({ icon: leftIcon, className: element('left-icon') })} </>}
            {label && <span className={element('content')}>{label}</span>}
            {rightIcon && <> {Icon({ icon: rightIcon, className: element('right-icon') })} </>}
        </>
    );

    // Build element props
    const elementProps: any = {
        ref,
        className: combinedClassName,
        onClick: isDisabled ? undefined : onClick,
        ...forwardedProps,
        ...disabledProps,
    };

    if (href) {
        elementProps.href = href;
    }
    if (target) {
        elementProps.target = target;
    }

    return <ElementType {...elementProps}>{content}</ElementType>;
};
