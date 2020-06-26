import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Different possible placements for the popover.
 */
enum Placement {
    AUTO = 'auto',
    AUTO_END = 'auto-end',
    AUTO_START = 'auto-start',

    TOP = 'top',
    TOP_END = 'top-end',
    TOP_START = 'top-start',

    RIGHT = 'right',
    RIGHT_END = 'right-end',
    RIGHT_START = 'right-start',

    BOTTOM = 'bottom',
    BOTTOM_END = 'bottom-end',
    BOTTOM_START = 'bottom-start',

    LEFT = 'left',
    LEFT_END = 'left-end',
    LEFT_START = 'left-start',
}

/**
 * Offset of the popover.
 */
interface Offset {
    /** Offset size along the reference. */
    along?: number;
    /** Offset size away from the reference. */
    away?: number;
}

/**
 * Popover elevation index.
 */
type Elevation = 1 | 2 | 3 | 4 | 5;

/**
 * The offset from the target in case of arrow.
 */
const ARROW_OFFSET = 8;

/**
 * Defines the props of the component.
 */
interface PopoverProps extends GenericProps {
    /** The reference of the anchor. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Children element displayed inside popover. */
    children: ReactNode;
    /** Whether the popover is open */
    isOpen: boolean;

    /** The desired placement */
    placement?: Placement;
    /** The desired offset */
    offset?: Offset;
    /** How high the component is flying */
    elevation?: Elevation;
    /** The z-axis position. */
    zIndex?: number;
    /** Whether the dropdown should fit to the anchor width */
    fitToAnchorWidth?: boolean;
    /** Whether a click anywhere out of the popover would close it. */
    closeOnClickAway?: boolean;
    /** Whether an escape key press would close the popover. */
    closeOnEscape?: boolean;
    /** Whether we put an arrow or not. */
    hasArrow?: boolean;
    /** The function to be called when the user clicks away or Escape is pressed */
    onClose?: VoidFunction;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Popover`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<PopoverProps> = {
    elevation: 3,
    placement: Placement.AUTO,
    zIndex: 9999,
    fitToAnchorWidth: false,
    closeOnClickAway: false,
    closeOnEscape: false,
    hasArrow: false,
};

/**
 * Popover.
 *
 * @param  props The component props.
 * @return The component.
 */
const Popover: React.FC<PopoverProps> = (props) => {
    const {
        anchorRef,
        placement,
        isOpen,
        children,
        fitToAnchorWidth = DEFAULT_PROPS.fitToAnchorWidth,
        offset,
        elevation = DEFAULT_PROPS.elevation,
        zIndex = DEFAULT_PROPS.zIndex,
        closeOnClickAway = DEFAULT_PROPS.closeOnClickAway,
        closeOnEscape = DEFAULT_PROPS.closeOnEscape,
        hasArrow = DEFAULT_PROPS.hasArrow,
        className,
        onClose,
        ...forwardedProps
    } = props;
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const wrapperRef = useRef(null);
    const actualOffset: [number, number] = [offset?.along ?? 0, (offset?.away ?? 0) + (hasArrow ? ARROW_OFFSET : 0)];
    const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: { offset: actualOffset },
            },
        ],
    });

    const popoverStyle = useMemo(() => {
        if (!fitToAnchorWidth || !anchorRef.current) {
            return { ...styles.popper, zIndex };
        }

        const boundingAnchor = anchorRef.current.getBoundingClientRect();
        return {
            ...styles.popper,
            zIndex,
            width: boundingAnchor.width,
        };
    }, [fitToAnchorWidth, anchorRef, styles]);

    useCallbackOnEscape(onClose, isOpen && closeOnEscape);

    const position = attributes?.popper?.['data-popper-placement'] ?? placement;

    return isOpen
        ? createPortal(
              <div
                  {...forwardedProps}
                  ref={setPopperElement}
                  className={classNames(
                      className,
                      handleBasicClasses({ prefix: CLASSNAME, elevation: Math.min(elevation || 0, 5), position }),
                  )}
                  style={popoverStyle}
                  {...attributes.popper}
              >
                  <div ref={wrapperRef} className={`${CLASSNAME}__wrapper`}>
                      <ClickAwayProvider callback={closeOnClickAway && onClose} refs={[wrapperRef, anchorRef]}>
                          {hasArrow ? (
                              <>
                                  <div className={`${CLASSNAME}__arrow`} />
                                  <div className={`${CLASSNAME}__inner`}>{children}</div>
                              </>
                          ) : (
                              children
                          )}
                      </ClickAwayProvider>
                  </div>
              </div>,
              document.body,
          )
        : null;
};
Popover.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, Offset };
