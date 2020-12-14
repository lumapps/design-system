import React, { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { uid } from 'uid';

import classNames from 'classnames';

import { Placement } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX, DOCUMENT } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useInjectTooltipRef } from './useInjectTooltipRef';
import { useTooltipOpen } from './useTooltipOpen';

/** Position of the tooltip relative to the anchor element. */
export type TooltipPlacement = Placement.TOP | Placement.RIGHT | Placement.BOTTOM | Placement.LEFT;

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends GenericProps {
    /** The children elements. Will act as the tooltip anchor. */
    children: ReactNode;
    /** The delay (in ms) before closing the tooltip. */
    delay?: number;
    /** Whether the tooltip is displayed even without the mouse hovering the anchor. */
    forceOpen?: boolean;
    /** The label of the tooltip. */
    label?: string | null | false;
    /** The placement of the tooltip based on the anchor element placement. */
    placement?: TooltipPlacement;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tooltip`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TooltipProps> = {
    delay: 500,
    placement: Placement.BOTTOM,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

export const Tooltip: Comp<TooltipProps> = (props) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const { label, children, className, delay, placement, forceOpen, ...forwardedProps } = props;
    if (!label) {
        return <>{children}</>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = useMemo(() => `tooltip-${uid()}`, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { styles, attributes } = usePopper(anchorElement, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: { offset: [0, OFFSET] },
            },
        ],
    });

    const position = attributes?.popper?.['data-popper-placement'] ?? placement;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isOpen = useTooltipOpen(delay as number, anchorElement) || forceOpen;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrappedChildren = useInjectTooltipRef(children, setAnchorElement, isOpen as boolean, id);

    return (
        <>
            {wrappedChildren}
            {isOpen &&
                createPortal(
                    <div
                        {...forwardedProps}
                        id={id}
                        ref={setPopperElement}
                        role="tooltip"
                        aria-label={label}
                        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, position }))}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <div className={`${CLASSNAME}__arrow`} />
                        <div className={`${CLASSNAME}__inner`}>
                            {label.indexOf('\n') !== -1
                                ? label.split('\n').map((sentence) => <p key={sentence}>{sentence}</p>)
                                : label}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
};
Tooltip.displayName = COMPONENT_NAME;
Tooltip.className = CLASSNAME;
Tooltip.defaultProps = DEFAULT_PROPS;
