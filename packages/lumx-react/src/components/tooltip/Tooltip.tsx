/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactNode, useState } from 'react';

import classNames from 'classnames';

import { DOCUMENT, VISUALLY_HIDDEN } from '@lumx/react/constants';
import { GenericProps, HasCloseMode } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { Placement } from '@lumx/react/components/popover';
import { TooltipContextProvider } from '@lumx/react/components/tooltip/context';
import { useId } from '@lumx/react/hooks/useId';
import { usePopper } from '@lumx/react/hooks/usePopper';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { ARIA_LINK_MODES, TOOLTIP_ZINDEX } from '@lumx/react/components/tooltip/constants';
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
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Tooltip';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tooltip';

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
    const { styles, attributes, update } = usePopper(anchorElement, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: { offset: [0, ARROW_SIZE] },
            },
        ],
    });

    const position = attributes?.popper?.['data-popper-placement'] ?? placement;
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

    // Update on open
    React.useEffect(() => {
        if (isOpen || popperElement) update?.();
    }, [isOpen, update, popperElement]);

    const labelLines = label ? label.split('\n') : [];

    const tooltipRef = useMergeRefs(ref, setPopperElement, onPopperMount);

    return (
        <>
            <TooltipContextProvider>{wrappedChildren}</TooltipContextProvider>
            {isMounted && (
                <Portal>
                    <div
                        ref={tooltipRef}
                        {...forwardedProps}
                        id={id}
                        role="tooltip"
                        className={classNames(
                            className,
                            handleBasicClasses({
                                prefix: CLASSNAME,
                                position,
                                isInitializing: !styles.popper?.transform,
                            }),
                            isHidden && VISUALLY_HIDDEN,
                        )}
                        style={{ ...(isHidden ? undefined : styles.popper), zIndex }}
                        {...attributes.popper}
                    >
                        <div className={`${CLASSNAME}__arrow`} />
                        <div className={`${CLASSNAME}__inner`}>
                            {labelLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
});
Tooltip.displayName = COMPONENT_NAME;
Tooltip.className = CLASSNAME;
Tooltip.defaultProps = DEFAULT_PROPS;
