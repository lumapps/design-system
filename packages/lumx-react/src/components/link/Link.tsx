import { Icon } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';
import { useDisableStateProps } from '@lumx/react/utils/disabled';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { classNames } from '@lumx/core/js/utils';
import { Link as UI, LinkProps as UIProps, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/Link';

const { element } = classNames.bem(CLASSNAME);

/**
 * Defines the props of the component.
 */
export interface LinkProps extends GenericProps, ReactToJSX<UIProps> {
    /**
     * Left icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    leftIcon?: string;
    /** Click handler. */
    onClick?: (event?: React.MouseEvent) => void;
    /**
     * Right icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    rightIcon?: string;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Link component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Link = forwardRef<LinkProps, HTMLAnchorElement | HTMLButtonElement>((props, ref) => {
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const { children, leftIcon, rightIcon, linkAs, onClick, ...forwardedProps } = otherProps;

    return UI({
        ref,
        ...disabledStateProps,
        ...forwardedProps,
        linkAs,
        handleClick: onClick,
        children: wrapChildrenIconWithSpaces(
            <>
                {leftIcon && <Icon icon={leftIcon} className={element('left-icon')} />}
                {children && <span className={element('content')}>{children}</span>}
                {rightIcon && <Icon icon={rightIcon} className={element('right-icon')} />}
            </>,
        ),
    });
});

Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
