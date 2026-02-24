import { ReactNode, RefObject, useRef } from 'react';

import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps } from '@lumx/react/utils/type';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { skipRender } from '@lumx/react/utils/react/skipRender';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import { Portal } from '@lumx/react/utils';
import {
    Popover as PopoverUI,
    type PopoverProps as CorePopoverProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Popover';
import { useRestoreFocusOnClose } from '@lumx/react/hooks/useRestoreFocusOnClose';
import { usePopoverStyle } from './usePopoverStyle';

/**
 * Defines the props of the component.
 * Extends core PopoverProps, overriding ref-typed props with React-specific `RefObject` types
 * and replacing `handleClose` with the React-idiomatic `onClose` callback.
 */
export interface PopoverProps
    extends GenericProps,
        ReactToJSX<
            CorePopoverProps,
            'anchorRef' | 'as' | 'boundaryRef' | 'focusElement' | 'parentElement' | 'focusTrapZoneElement' | 'className'
        > {
    /** Reference to the DOM element used to set the position of the popover. */
    anchorRef: RefObject<HTMLElement>;
    /** Customize the root element. (Must accept ref forwarding and props forwarding!). */
    as?: React.ElementType;
    /** Element which will act as boundary when opening the popover. */
    boundaryRef?: RefObject<HTMLElement>;
    /** Content. */
    children: ReactNode;
    /** Element to focus when opening the popover. */
    focusElement?: RefObject<HTMLElement>;
    /** Reference to the parent element that triggered the popover (will get back focus on close or else fallback on the anchor element). */
    parentElement?: RefObject<HTMLElement>;
    /** Whether the popover should be rendered into a DOM node that exists outside the DOM hierarchy of the parent component. */
    usePortal?: boolean;
    /** The element in which the focus trap should be set. Default to popover. */
    focusTrapZoneElement?: RefObject<HTMLElement>;
    /** On close callback (on click away or Escape pressed). */
    onClose?(): void;
}

// Inner component (must be wrapped before export)
const _InnerPopover = forwardRef<PopoverProps, HTMLDivElement>((props, ref) => {
    const {
        anchorRef,
        as,
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

    const { styles, isPositioned, position, setArrowElement, setPopperElement, popperElement } = usePopoverStyle({
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

    return PopoverUI(
        {
            ...forwardedProps,
            as: as as string,
            children,
            className,
            elevation,
            hasArrow,
            isOpen,
            position,
            popoverStyle: styles.popover,
            arrowStyle: styles.arrow,
            theme,
            ref: mergedRefs,
            arrowRef: setArrowElement,
            usePortal,
            clickAwayCallback: closeOnClickAway && onClose,
            clickAwayRefs,
            unmountSentinel,
        },
        { Portal, ClickAwayProvider, ThemeProvider },
    );
});
_InnerPopover.displayName = COMPONENT_NAME;

/**
 * Popover component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Popover = skipRender(
    // Skip render in SSR
    () => Boolean(DOCUMENT),
    _InnerPopover,
) as Comp<PopoverProps, HTMLDivElement>;
Popover.displayName = COMPONENT_NAME;
Popover.className = CLASSNAME;
Popover.defaultProps = DEFAULT_PROPS as Partial<PopoverProps>;
