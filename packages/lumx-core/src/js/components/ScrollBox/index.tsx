import { Orientation } from '../../constants';
import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { getFlexBoxProps } from '../FlexBox';

/**
 * Defines the props for the core ScrollBox template.
 */
export interface ScrollBoxProps extends HasClassName {
    /** Content to scroll. */
    children?: JSXElement;
    /**
     * Snap the scroll position to the start and the end of the content, and scroll smoothly
     * (when motion is not reduced). Useful for keyboard navigation in a list of options.
     */
    scrollSnap?: boolean;
    /** Additional inline style. */
    style?: Record<string, any>;
    /** Reference to the root element. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ScrollBox';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-scroll-box';
const { block } = classNames.bem(CLASSNAME);

/**
 * ScrollBox core template (internal).
 * Renders a vertical flex box whose content scrolls on the y axis.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ScrollBox = (props: ScrollBoxProps) => {
    const { children, className, scrollSnap, style, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...getFlexBoxProps({
                ...forwardedProps,
                orientation: Orientation.vertical,
                className: block({ 'scroll-snap': scrollSnap }, className),
            })}
        >
            {children}
        </div>
    );
};

ScrollBox.displayName = COMPONENT_NAME;
ScrollBox.className = CLASSNAME;
