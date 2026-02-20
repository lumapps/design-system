/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactNode, useState } from 'react';

import { useFloating, offset, autoUpdate, type Placement as FloatingPlacement } from '@floating-ui/react-dom';

import { DOCUMENT } from '@lumx/react/constants';
import { GenericProps, HasCloseMode } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { Placement } from '@lumx/react/components/popover';
import { TooltipContextProvider } from '@lumx/react/components/tooltip/context';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { ARIA_LINK_MODES, TOOLTIP_ZINDEX } from '@lumx/react/components/tooltip/constants';
import { isPopoverSupported } from '@lumx/react/utils/browser/isPopoverSupported';
import { Portal } from '@lumx/react/utils';
import { useInjectTooltipRef } from './useInjectTooltipRef';
import { useTooltipOpen } from './useTooltipOpen';

/** Position of the tooltip relative to the anchor element. */
export type TooltipPlacement = Extract<Placement, 'top' | 'right' | 'bottom' | 'left'>;

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends GenericProps, HasCloseMode {
    /** Anchor (element on which we activate the tooltip). */
    children: ReactNode;
    /** Delay (in ms) before closing the tooltip. */
    delay?: number;
    /** Whether the tooltip is displayed even without the mouse hovering the anchor. */
    forceOpen?: boolean;
    /** Label text. */
    label?: string | null | false;
    /** Placement of the tooltip relative to the anchor. */
    placement?: TooltipPlacement;
    /** Choose how the tooltip text should link to the anchor */
    ariaLinkMode?: (typeof ARIA_LINK_MODES)[number];
    /**
     * z-index positioning
     * @deprecated Never really needed. Ignored on browsers supporting the HTML popover API
     */
    zIndex?: number;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Tooltip';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tooltip';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TooltipProps> = {
    placement: Placement.BOTTOM,
    closeMode: 'unmount',
    ariaLinkMode: 'aria-describedby',
    zIndex: TOOLTIP_ZINDEX,
};

/**
 * Arrow size (in pixel).
 */
const ARROW_SIZE = 8;

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
        whileElementsMounted: autoUpdate,
        middleware: [offset(ARROW_SIZE)],
        elements: { reference: anchorElement, floating: popperElement },
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

    // Update popover visibility on open/close.
    React.useEffect(() => {
        if (!popperElement?.popover) return;
        try {
            if (isOpen) popperElement.showPopover();
            else popperElement.hidePopover();
        } catch {
            /* already open/closed */
        }
    }, [isOpen, popperElement]);

    const labelLines = label ? label.split('\n') : [];

    const tooltipRef = useMergeRefs(ref, setPopperElement, onPopperMount);

    let popover: React.HTMLAttributes<any>['popover'];
    let Wrapper = Portal;

    if (isPopoverSupported()) {
        // Use native HTML popover API
        popover = forceOpen ? 'manual' : 'hint';
        // No need for Portal (originally used to escape potential parent hidden/cliped overflow)
        Wrapper = React.Fragment;
    }

    return (
        <>
            <TooltipContextProvider>{wrappedChildren}</TooltipContextProvider>
            {isMounted && (
                <Wrapper>
                    <div
                        ref={tooltipRef}
                        {...forwardedProps}
                        role="tooltip"
                        popover={popover}
                        id={id}
                        className={classNames.join(
                            className,
                            block({
                                [`position-${position}`]: Boolean(position),
                            }),
                            !popover && isHidden && classNames.visuallyHidden(),
                        )}
                        style={{ ...(isHidden ? undefined : floatingStyles), ...(!popover && { zIndex }) }}
                        data-popper-placement={position}
                    >
                        <div className={element('arrow')} />
                        <div className={element('inner')}>
                            {labelLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                    </div>
                </Wrapper>
            )}
        </>
    );
});
Tooltip.displayName = COMPONENT_NAME;
Tooltip.className = CLASSNAME;
Tooltip.defaultProps = DEFAULT_PROPS;
