/* eslint-disable react-hooks/rules-of-hooks */
import { ReactNode, useState } from 'react';

import { useFloating, offset, autoUpdate, type Placement as FloatingPlacement } from '@floating-ui/react-dom';

import { DOCUMENT, IS_BROWSER } from '@lumx/react/constants';
import { GenericProps } from '@lumx/react/utils/type';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';

import { TooltipContextProvider } from '@lumx/react/components/tooltip/context';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import {
    TooltipPopup,
    type TooltipProps as CoreTooltipProps,
    type TooltipPlacement,
    DEFAULT_PROPS,
    CLASSNAME as CORE_CLASSNAME,
    COMPONENT_NAME as CORE_COMPONENT_NAME,
    ARROW_SIZE,
} from '@lumx/core/js/components/Tooltip';
import { Portal } from '@lumx/react/utils';
import { useInjectTooltipRef } from './useInjectTooltipRef';
import { useTooltipOpen } from './useTooltipOpen';

export type { TooltipPlacement };

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends GenericProps, CoreTooltipProps {
    /** Anchor (element on which we activate the tooltip). */
    children: ReactNode;
}

/**
 * Tooltip component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Tooltip = forwardRef<TooltipProps, HTMLDivElement>((props, ref) => {
    const {
        label,
        children,
        className,
        delay,
        placement = DEFAULT_PROPS.placement,
        forceOpen,
        closeMode = DEFAULT_PROPS.closeMode,
        ariaLinkMode = DEFAULT_PROPS.ariaLinkMode,
        zIndex = DEFAULT_PROPS.zIndex,
        ...forwardedProps
    } = props;
    // Disable in SSR.
    if (!DOCUMENT) {
        return <>{children}</>;
    }

    const id = useId();

    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const { floatingStyles, placement: resolvedPlacement } = useFloating({
        placement: placement as FloatingPlacement,
        // Disable autoUpdate and element refs in non-browser environments (e.g. jsdom) to avoid
        // flushSync act() warnings from @floating-ui/react-dom (positioning is not meaningful in jsdom anyway).
        ...(IS_BROWSER
            ? {
                  whileElementsMounted: autoUpdate,
                  elements: { reference: anchorElement, floating: popperElement },
              }
            : {}),
        middleware: [offset(ARROW_SIZE)],
    });

    const position = resolvedPlacement ?? placement;
    const { isOpen: isActivated, onPopperMount } = useTooltipOpen(delay, anchorElement);
    const isOpen = (isActivated || forceOpen) && !!label;
    const isMounted = !!label && (isOpen || closeMode === 'hide');
    const isHidden = !isOpen && closeMode === 'hide';
    const wrappedChildren = useInjectTooltipRef({
        children,
        setAnchorElement,
        isMounted,
        id,
        label,
        ariaLinkMode: ariaLinkMode as any,
    });

    const tooltipRef = useMergeRefs(ref, setPopperElement, onPopperMount);

    return (
        <>
            <TooltipContextProvider>{wrappedChildren}</TooltipContextProvider>
            {isMounted && (
                <Portal>
                    {TooltipPopup({
                        ref: tooltipRef,
                        ...forwardedProps,
                        id,
                        label: label as string,
                        position: position!,
                        isHidden,
                        style: isHidden ? undefined : floatingStyles,
                        zIndex,
                        className,
                    })}
                </Portal>
            )}
        </>
    );
});
Tooltip.displayName = CORE_COMPONENT_NAME;
Tooltip.className = CORE_CLASSNAME;
Tooltip.defaultProps = DEFAULT_PROPS;
