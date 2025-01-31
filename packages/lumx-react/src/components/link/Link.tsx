import classNames from 'classnames';

import { ColorVariant, ColorWithVariants, Icon, Typography } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { getTypographyClassName, handleBasicClasses, resolveColorWithVariants } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';
import { HasAriaDisabled } from '@lumx/react/utils/type/HasAriaDisabled';
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
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, color, colorVariant, hasTypography: !!typography }),
                typography && getTypographyClassName(typography),
            )}
        >
            {wrapChildrenIconWithSpaces(
                <>
                    {leftIcon && <Icon icon={leftIcon} className={`${CLASSNAME}__left-icon`} />}
                    {children && <span className={`${CLASSNAME}__content`}>{children}</span>}
                    {rightIcon && <Icon icon={rightIcon} className={`${CLASSNAME}__right-icon`} />}
                </>,
            )}
        </RawClickable>
    );
});
Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
