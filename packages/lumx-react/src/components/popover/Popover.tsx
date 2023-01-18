import React, { forwardRef, ReactNode, RefObject, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { getFirstAndLastFocusable } from '@lumx/react/utils/focus/getFirstAndLastFocusable';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { skipRender } from '@lumx/react/utils/skipRender';

import { usePopoverStyle } from './usePopoverStyle';
import { FitAnchorWidth, Elevation, Offset, Placement } from './constants';

/**
 * Defines the props of the component.
 */
export interface PopoverProps extends GenericProps {
    /** Reference to the DOM element used to set the position of the popover. */
    anchorRef: React.RefObject<HTMLElement>;
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
    usePortal: true,
    zIndex: 9999,
};

/** Method to render the popover inside a portal if usePortal is true */
const renderPopover = (children: ReactNode, usePortal?: boolean): any => {
    return usePortal ? createPortal(children, document.body) : children;
};

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
    forwardRef((props, ref) => {
        const {
            anchorRef,
            children,
            className,
            closeOnClickAway,
            closeOnEscape,
            elevation,
            focusElement,
            hasArrow,
            isOpen,
            onClose,
            parentElement,
            usePortal,
            focusAnchorOnClose = true,
            withFocusTrap,
            boundaryRef,
            fitToAnchorWidth,
            fitWithinViewportHeight,
            offset,
            placement,
            style,
            zIndex,
            ...forwardedProps
        } = props;
        const clickAwayRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        const {
            styles,
            attributes,
            isPositioned,
            position,
            setArrowElement,
            setPopperElement,
            popperElement,
        } = usePopoverStyle({
            offset,
            hasArrow,
            fitToAnchorWidth,
            fitWithinViewportHeight,
            boundaryRef,
            anchorRef,
            children,
            placement,
            style,
            zIndex,
        });

        /**
         * Track whether the focus is currently set in the
         * popover.
         * */
        const isFocusedWithin = useRef(false);

        useFocusWithin({
            element: popperElement || null,
            onFocusIn: () => {
                isFocusedWithin.current = true;
            },
            onFocusOut: () => {
                isFocusedWithin.current = false;
            },
        });

        /** Action on close */
        const handleClose = useCallback(() => {
            if (!onClose) {
                return;
            }

            /**
             * If the focus is currently within the popover
             * when the popover closes, reset the focus back to the anchor element
             * unless specifically requested not to.
             */
            if (isFocusedWithin.current && focusAnchorOnClose) {
                if (parentElement?.current) {
                    parentElement?.current.focus();
                }

                const firstFocusable = anchorRef?.current && getFirstAndLastFocusable(anchorRef?.current).first;
                if (firstFocusable) {
                    // Focus the first focusable element in anchor.
                    firstFocusable.focus();
                } else {
                    // Fallback on the anchor element.
                    anchorRef?.current?.focus();
                }
            }

            onClose();
        }, [anchorRef, focusAnchorOnClose, onClose, parentElement]);

        useCallbackOnEscape(handleClose, isOpen && closeOnEscape);

        /** Only set focus within if the focus trap is disabled as they interfere with one another. */
        useFocus(focusElement?.current, !withFocusTrap && isOpen && isPositioned);
        useFocusTrap(withFocusTrap && isOpen && contentRef?.current, focusElement?.current);

        const clickAwayRefs = useRef([clickAwayRef, anchorRef]);

        return isOpen
            ? renderPopover(
                  <div
                      {...forwardedProps}
                      ref={mergeRefs<HTMLDivElement>(setPopperElement, ref, clickAwayRef, contentRef)}
                      className={classNames(
                          className,
                          handleBasicClasses({ prefix: CLASSNAME, elevation: Math.min(elevation || 0, 5), position }),
                      )}
                      style={styles.popover}
                      {...attributes.popper}
                  >
                      <ClickAwayProvider callback={closeOnClickAway && handleClose} childrenRefs={clickAwayRefs}>
                          {hasArrow && (
                              <div ref={setArrowElement} className={`${CLASSNAME}__arrow`} style={styles.arrow} />
                          )}
                          {children}
                      </ClickAwayProvider>
                  </div>,
                  usePortal,
              )
            : null;
    }),
);
Popover.displayName = COMPONENT_NAME;
Popover.className = CLASSNAME;
Popover.defaultProps = DEFAULT_PROPS;
