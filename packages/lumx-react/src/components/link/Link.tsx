import React from 'react';

import { Typography } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { Link as UI, LinkProps as UIProps, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/Link';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
export interface LinkProps extends GenericProps, ReactToJSX<UIProps, 'label'> {
    /** Link href. */
    href?: HTMLAnchorProps['href'];
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Link target. */
    target?: HTMLAnchorProps['target'];
    /** Typography variant. */
    typography?: Typography;
    /** Click handler. */
    onClick?: (event: React.MouseEvent) => void;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<LinkProps> = {};

/**
 * Link component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Link = forwardRef<LinkProps, HTMLAnchorElement | HTMLButtonElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const { children, className, color, colorVariant, leftIcon, rightIcon, typography, linkAs, ...forwardedProps } =
        otherProps;

    // Wrap children with spaces if they contain icons
    const label = wrapChildrenIconWithSpaces(children);

    return UI({
        ref,
        label,
        className,
        color,
        colorVariant,
        leftIcon,
        rightIcon,
        typography,
        as: linkAs,
        ...forwardedProps,
        ...disabledStateProps,
        isDisabled: isAnyDisabled,
    });
});
Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
Link.defaultProps = DEFAULT_PROPS;
