import { ColorVariant, ColorWithVariants, Icon, Typography } from '@lumx/react';
import { GenericProps, HasAriaDisabled } from '@lumx/react/utils/type';
import { resolveColorWithVariants } from '@lumx/core/js/utils/_internal/color';
import { classNames } from '@lumx/core/js/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';
import { RawClickable } from '@lumx/react/utils/react/RawClickable';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
export interface LinkProps extends GenericProps, HasAriaDisabled {
    /** Color variant. */
    color?: ColorWithVariants;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: HTMLAnchorProps['href'];
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /**
     * Left icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    leftIcon?: string;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /**
     * Right icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    rightIcon?: string;
    /** Link target. */
    target?: HTMLAnchorProps['target'];
    /** Typography variant. */
    typography?: Typography;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Link';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-link';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Link component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Link = forwardRef<LinkProps, HTMLAnchorElement | HTMLButtonElement>((props, ref) => {
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        children,
        className,
        color: propColor,
        colorVariant: propColorVariant,
        leftIcon,
        rightIcon,
        typography,
        linkAs,
        ...forwardedProps
    } = otherProps;
    const [color, colorVariant] = resolveColorWithVariants(propColor, propColorVariant);

    return (
        <RawClickable
            ref={ref as any}
            as={linkAs || (forwardedProps.href ? 'a' : 'button')}
            {...forwardedProps}
            {...disabledStateProps}
            className={classNames.join(
                className,
                block({
                    [`color-${color}`]: Boolean(color),
                    [`color-variant-${colorVariant}`]: Boolean(colorVariant),
                    'has-typography': !!typography,
                }),
                typography && classNames.typography(typography),
            )}
        >
            {wrapChildrenIconWithSpaces(
                <>
                    {leftIcon && <Icon icon={leftIcon} className={element('left-icon')} />}
                    {children && <span className={element('content')}>{children}</span>}
                    {rightIcon && <Icon icon={rightIcon} className={element('right-icon')} />}
                </>,
            )}
        </RawClickable>
    );
});
Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
