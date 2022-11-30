import { detectOverflow } from '@popperjs/core';
import React, { forwardRef, ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import classNames from 'classnames';
import memoize from 'lodash/memoize';

import { DOCUMENT, WINDOW } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

import { Comp, GenericProps, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { getFirstAndLastFocusable } from '@lumx/react/utils/focus/getFirstAndLastFocusable';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';

/**
 * Different possible placements for the popover.
 */
export const Placement = {
    AUTO: 'auto',
    AUTO_END: 'auto-end',
    AUTO_START: 'auto-start',

    TOP: 'top',
    TOP_END: 'top-end',
    TOP_START: 'top-start',

    RIGHT: 'right',
    RIGHT_END: 'right-end',
    RIGHT_START: 'right-start',

    BOTTOM: 'bottom',
    BOTTOM_END: 'bottom-end',
    BOTTOM_START: 'bottom-start',

    LEFT: 'left',
    LEFT_END: 'left-end',
    LEFT_START: 'left-start',
} as const;
export type Placement = ValueOf<typeof Placement>;

/**
 * Offset of the popover.
 */
export interface Offset {
    /** Offset size along the reference. */
    along?: number;
    /** Offset size away from the reference. */
    away?: number;
}

/**
 * Popover elevation index.
 */
export type Elevation = 1 | 2 | 3 | 4 | 5;

/**
 * Arrow size (in pixel).
 */
const ARROW_SIZE = 8;

const AnchorWidthOptions = {
    MAX_WIDTH: 'maxWidth',
    MIN_WIDTH: 'minWidth',
    WIDTH: 'width',
} as const;
type AnchorWidthOption = ValueOf<typeof AnchorWidthOptions>;

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
    fitToAnchorWidth?: AnchorWidthOption | boolean;
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

/**
 * Popper js modifier to fit popover min width to the anchor width.
 */
const sameWidth = memoize((anchorWidthOption: AnchorWidthOption) => ({
    name: 'sameWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn({ state }: any) {
        // eslint-disable-next-line no-param-reassign
        state.styles.popper[anchorWidthOption] = `${state.rects.reference.width}px`;
    },
    effect({ state }: any) {
        // eslint-disable-next-line no-param-reassign
        state.elements.popper.style[anchorWidthOption] = `${state.elements.reference.offsetWidth}px`;
    },
}));

/**
 * Popper js modifier to compute max size of the popover.
 */
const maxSize = {
    name: 'maxSize',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['offset', 'preventOverflow', 'flip'],
    fn({ state, name, options }: any) {
        const overflow = detectOverflow(state, options);

        const { y = 0, x = 0 } = state.modifiersData.preventOverflow;
        const { width, height } = state.rects.popper;

        const [basePlacement] = state.placement.split('-');

        const widthProp = basePlacement === 'left' ? 'left' : 'right';
        const heightProp = basePlacement === 'top' ? 'top' : 'bottom';
        // eslint-disable-next-line no-param-reassign
        state.modifiersData[name] = {
            width: width - overflow[widthProp] - x,
            height: height - overflow[heightProp] - y,
        };
    },
};

/**
 * Popper js modifier to apply the max height.
 */
const applyMaxHeight = {
    name: 'applyMaxHeight',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['maxSize'],
    fn({ state }: any) {
        const { height } = state.modifiersData.maxSize;
        // eslint-disable-next-line no-param-reassign
        state.elements.popper.style.maxHeight = `${height - ARROW_SIZE}px`;
    },
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
export const Popover: Comp<PopoverProps, HTMLDivElement> = forwardRef((props, ref) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }

    const {
        anchorRef,
        boundaryRef,
        children,
        className,
        closeOnClickAway,
        closeOnEscape,
        elevation,
        fitToAnchorWidth,
        fitWithinViewportHeight,
        focusElement,
        hasArrow,
        isOpen,
        offset,
        onClose,
        parentElement,
        placement,
        style,
        usePortal,
        zIndex,
        focusAnchorOnClose = true,
        withFocusTrap,
        ...forwardedProps
    } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [popperElement, setPopperElement] = useState<HTMLDivElement>();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [arrowElement, setArrowElement] = useState<null | HTMLElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const clickAwayRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contentRef = useRef<HTMLDivElement>(null);

    /**
     * Track whether the focus is currently set in the
     * popover.
     * */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isFocusedWithin = useRef(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    const modifiers: any = [];
    const actualOffset: [number, number] = [offset?.along ?? 0, (offset?.away ?? 0) + (hasArrow ? ARROW_SIZE : 0)];
    modifiers.push({
        name: 'offset',
        options: { offset: actualOffset },
    });
    if (hasArrow && arrowElement) {
        modifiers.push({ name: 'arrow', options: { element: arrowElement, padding: ARROW_SIZE } });
    }

    if (fitToAnchorWidth) {
        const anchorWidthOption =
            typeof fitToAnchorWidth === 'string' ? fitToAnchorWidth : AnchorWidthOptions.MIN_WIDTH;
        modifiers.push(sameWidth(anchorWidthOption));
    }
    if (fitWithinViewportHeight) {
        modifiers.push({ ...maxSize, options: { boundary: boundaryRef?.current } }, applyMaxHeight);
    }
    if (boundaryRef) {
        modifiers.push({ name: 'flip', options: { boundary: boundaryRef.current } });
        modifiers.push({ name: 'preventOverflow', options: { boundary: boundaryRef.current } });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { styles, attributes, state, update } = usePopper(anchorRef.current, popperElement, {
        placement,
        modifiers,
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        update?.();
    }, [children, update]);

    const position = state?.placement ?? placement;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const popoverStyle = useMemo(() => {
        const newStyles = { ...style, ...styles.popper, zIndex };

        if (fitWithinViewportHeight && !newStyles.maxHeight) {
            newStyles.maxHeight = WINDOW?.innerHeight || DOCUMENT?.documentElement.clientHeight;
        }

        return newStyles;
    }, [style, styles.popper, zIndex, fitWithinViewportHeight]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallbackOnEscape(handleClose, isOpen && closeOnEscape);

    /** Only set focus within if the focus trap is disabled as they interfere with one another. */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocus(focusElement?.current, !withFocusTrap && isOpen && (state?.rects?.popper?.y ?? -1) >= 0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocusTrap(withFocusTrap && isOpen && contentRef?.current, focusElement?.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
                  style={popoverStyle}
                  {...attributes.popper}
              >
                  <ClickAwayProvider callback={closeOnClickAway && handleClose} childrenRefs={clickAwayRefs}>
                      {hasArrow && <div ref={setArrowElement} className={`${CLASSNAME}__arrow`} style={styles.arrow} />}
                      {children}
                  </ClickAwayProvider>
              </div>,
              usePortal,
          )
        : null;
});
Popover.displayName = COMPONENT_NAME;
Popover.className = CLASSNAME;
Popover.defaultProps = DEFAULT_PROPS;
