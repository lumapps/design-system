import React, { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import uuid from 'uuid/v4';

import classNames from 'classnames';

import { Placement } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useInjectTooltipRef } from './useInjectTooltipRef';
import { useTooltipOpen } from './useTooltipOpen';

/** Position of the tooltip relative to the anchor element. */
type TooltipPlacement = Placement.TOP | Placement.RIGHT | Placement.BOTTOM | Placement.LEFT;

/**
 * Defines the props of the component.
 */
interface TooltipProps extends GenericProps {
    /** The children elements to be transcluded into the component. Will act as the tooltip anchor. */
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TooltipProps> = {
    delay: 500,
    forceOpen: false,
    placement: Placement.BOTTOM,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

const Tooltip: React.FC<TooltipProps> = ({
    children,
    className,
    delay = DEFAULT_PROPS.delay as number,
    forceOpen = DEFAULT_PROPS.forceOpen as boolean,
    label,
    placement = DEFAULT_PROPS.placement,
    ...forwardedProps
}) => {
    if (!label) {
        return <>{children}</>;
    }

    const id = useMemo(() => `tooltip-${uuid()}`, []);

    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
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
    const isOpen = useTooltipOpen(delay, anchorElement) || forceOpen;
    const wrappedChildren = useInjectTooltipRef(children, setAnchorElement, isOpen, id);

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

export { CLASSNAME, DEFAULT_PROPS, useTooltipOpen, Tooltip, TooltipPlacement, TooltipProps };
