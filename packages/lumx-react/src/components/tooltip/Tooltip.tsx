/* eslint-disable react-hooks/rules-of-hooks */
import React, { forwardRef, ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { uid } from 'uid';

import classNames from 'classnames';

import { Placement } from '@lumx/react/components/popover/Popover';

import { DOCUMENT, TOOLTIP_HOVER_DELAY, TOOLTIP_LONG_PRESS_DELAY } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import { useOpenHoverOrLongPress } from '@lumx/react/hooks/useOpenHoverOrLongPress';
import { useInjectTooltipRef } from './useInjectTooltipRef';

/** Position of the tooltip relative to the anchor element. */
export type TooltipPlacement = Extract<Placement, 'top' | 'right' | 'bottom' | 'left'>;

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends GenericProps {
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
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Tooltip';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TooltipProps> = {
    placement: Placement.BOTTOM,
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
export const Tooltip: Comp<TooltipProps, HTMLDivElement> = forwardRef((props, ref) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const { label, children, className, delay, placement, forceOpen, ...forwardedProps } = props;
    if (!label) {
        return <>{children}</>;
    }

    const id = useMemo(() => `tooltip-${uid()}`, []);

    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const { styles, attributes } = usePopper(anchorElement, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: { offset: [0, ARROW_SIZE] },
            },
        ],
    });

    const position = attributes?.popper?.['data-popper-placement'] ?? placement;
    const isOpen =
        useOpenHoverOrLongPress(anchorElement, {
            hover: { openDelay: delay ?? TOOLTIP_HOVER_DELAY.openDelay, closeDelay: TOOLTIP_HOVER_DELAY.closeDelay },
            longPress: TOOLTIP_LONG_PRESS_DELAY,
        }) || forceOpen;
    const wrappedChildren = useInjectTooltipRef(children, setAnchorElement, isOpen as boolean, id);

    return (
        <>
            {wrappedChildren}
            {isOpen &&
                createPortal(
                    <div
                        ref={mergeRefs(ref, setPopperElement)}
                        {...forwardedProps}
                        id={id}
                        role="tooltip"
                        aria-label={label}
                        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, position }))}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <div className={`${CLASSNAME}__arrow`} />
                        <div className={`${CLASSNAME}__inner`}>
                            {label.indexOf('\n') !== -1
                                ? label.split('\n').map((sentence: string) => <p key={sentence}>{sentence}</p>)
                                : label}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
});
Tooltip.displayName = COMPONENT_NAME;
Tooltip.className = CLASSNAME;
Tooltip.defaultProps = DEFAULT_PROPS;
