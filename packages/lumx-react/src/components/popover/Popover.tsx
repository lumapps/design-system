import React, { ReactNode, RefObject, useRef } from 'react';

import classNames from 'classnames';

import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { skipRender } from '@lumx/react/utils/react/skipRender';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import { Portal } from '@lumx/react/utils';
import { useRestoreFocusOnClose } from './useRestoreFocusOnClose';
import { usePopoverStyle } from './usePopoverStyle';
import { Elevation, FitAnchorWidth, Offset, Placement, POPOVER_ZINDEX } from './constants';

/**
 * Defines the props of the component.
 */
export interface PopoverProps extends GenericProps, HasTheme {
    /** Reference to the DOM element used to set the position of the popover. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Customize the root element. (Must accept ref forwarding and props forwarding!). */
    as?: React.ElementType;
    /** Element which will act as boundary when opening the popover. */
    boundaryRef?: RefObject<HTMLElement>;
    /** Content. */
    children: ReactNode;
    /** Whether a click anywhere out of the popover would close it. */
    closeOnClickAway?: boolean;
    /** Whether an escape key press would close the popover. */
    closeOnEscape?: boolean;
    /** Shadow elevation. */
    elevation?: Elevation;
    /**
     * Manage popover width:
     *   - `maxWidth`: popover not bigger than anchor
     *   - `minWidth` or `true`: popover not smaller than anchor
     *   - `width`: popover equal to the anchor.
     */
    fitToAnchorWidth?: FitAnchorWidth | boolean;
    /** Shrink popover if even after flipping there is not enough space. */
    fitWithinViewportHeight?: boolean;
    /** Element to focus when opening the popover. */
    focusElement?: RefObject<HTMLElement>;
    /** Whether the focus should go back on the anchor when popover closes and focus is within. */
    focusAnchorOnClose?: boolean;
    /** Whether we put an arrow or not. */
    hasArrow?: boolean;
    /** Whether the popover is open or not. */
    isOpen: boolean;
    /** Offset placement relative to anchor. */
    offset?: Offset;
    /** Reference to the parent element that triggered the popover (will get back focus on close or else fallback on the anchor element). */
    parentElement?: RefObject<HTMLElement>;
    /** Placement relative to anchor. */
    placement?: Placement;
    /** Whether the popover should be rendered into a DOM node that exists outside the DOM hierarchy of the parent component. */
    usePortal?: boolean;
    /** The element in which the focus trap should be set. Default to popover. */
    focusTrapZoneElement?: RefObject<HTMLElement>;
    /** Z-axis position. */
    zIndex?: number;
    /** On close callback (on click away or Escape pressed). */
    onClose?(): void;
    /** Whether the popover should trap the focus within itself. Default to false. */
    withFocusTrap?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Popover';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<PopoverProps> = {
    elevation: 3,
    placement: Placement.AUTO,
    focusAnchorOnClose: true,
    usePortal: true,
    zIndex: POPOVER_ZINDEX,
};

// Inner component (must be wrapped before export)
const _InnerPopover = forwardRef<PopoverProps, HTMLDivElement>((props, ref) => {
    const {
        anchorRef,
        as: Component = 'div',
        children,
        className,
        closeOnClickAway,
        closeOnEscape,
        elevation = DEFAULT_PROPS.elevation,
        focusElement,
        hasArrow,
        isOpen,
        onClose,
        parentElement,
        usePortal = DEFAULT_PROPS.usePortal,
        focusAnchorOnClose = DEFAULT_PROPS.focusAnchorOnClose,
        withFocusTrap,
        boundaryRef,
        fitToAnchorWidth,
        fitWithinViewportHeight,
        focusTrapZoneElement,
        offset,
        placement = DEFAULT_PROPS.placement,
        style,
        theme,
        zIndex = DEFAULT_PROPS.zIndex,
        ...forwardedProps
    } = props;
    const popoverRef = useRef<HTMLDivElement>(null);

    const { styles, attributes, isPositioned, position, setArrowElement, setPopperElement, popperElement } =
        usePopoverStyle({
            offset,
            hasArrow,
            fitToAnchorWidth,
            fitWithinViewportHeight,
            boundaryRef,
            anchorRef,
            placement,
            style,
            zIndex,
        });

    const unmountSentinel = useRestoreFocusOnClose({ focusAnchorOnClose, anchorRef, parentElement }, popperElement);
    const focusZoneElement = focusTrapZoneElement?.current || popoverRef?.current;

    useCallbackOnEscape(onClose, isOpen && closeOnEscape);

    /** Only set focus within if the focus trap is disabled as they interfere with one another. */
    useFocus(focusElement?.current, !withFocusTrap && isOpen && isPositioned);
    useFocusTrap(withFocusTrap && isOpen && focusZoneElement, focusElement?.current);

    const clickAwayRefs = useRef([popoverRef, anchorRef]);
    const mergedRefs = useMergeRefs<HTMLDivElement>(setPopperElement, ref, popoverRef);

    return isOpen ? (
        <Portal enabled={usePortal}>
            <Component
                {...forwardedProps}
                ref={mergedRefs}
                className={classNames(
                    className,
                    handleBasicClasses({
                        prefix: CLASSNAME,
                        theme,
                        elevation: Math.min(elevation || 0, 5),
                        position,
                        isInitializing: !styles.popover?.transform,
                    }),
                )}
                style={styles.popover}
                {...attributes.popper}
            >
                {unmountSentinel}
                <ClickAwayProvider callback={closeOnClickAway && onClose} childrenRefs={clickAwayRefs}>
                    {hasArrow && (
                        <div ref={setArrowElement} className={`${CLASSNAME}__arrow`} style={styles.arrow}>
                            <svg viewBox="0 0 14 14" aria-hidden>
                                <path d="M8 3.49C7.62 2.82 6.66 2.82 6.27 3.48L.04 14 14.04 14 8 3.49Z" />
                            </svg>
                        </div>
                    )}
                    <ThemeProvider value={theme}>{children}</ThemeProvider>
                </ClickAwayProvider>
            </Component>
        </Portal>
    ) : null;
});
_InnerPopover.displayName = COMPONENT_NAME;

/**
 * Popover component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Popover: Comp<PopoverProps, HTMLDivElement> = skipRender(
    // Skip render in SSR
    () => Boolean(DOCUMENT),
    _InnerPopover,
);
Popover.displayName = COMPONENT_NAME;
Popover.className = CLASSNAME;
Popover.defaultProps = DEFAULT_PROPS;
