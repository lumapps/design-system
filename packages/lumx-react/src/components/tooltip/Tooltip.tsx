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
 * Defines the optional props of the component.
 */
interface OptionalTooltipProps extends GenericProps {
    /** Delay in ms before closing the tooltip . */
    delay?: number;

    /** Placement of tooltip relative to the anchor element. */
    placement?: TooltipPlacement;

    /** Force tooltip to show even without the mouse over the anchor. */
    forceOpen?: boolean;
}

/**
 * Defines the props of the component.
 */
interface TooltipProps extends OptionalTooltipProps {
    /** Tooltip label. */
    label?: string | null | false;

    /** Tooltip anchor. */
    children: ReactNode;
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
const DEFAULT_PROPS: Required<OptionalTooltipProps> = {
    delay: 500,
    placement: Placement.BOTTOM,
    forceOpen: false,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

/**
 * Tooltip.
 *
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices/#tooltip
 * @param  props The component props.
 * @return The component.
 */
const Tooltip: React.FC<TooltipProps> = (props) => {
    const {
        label,
        children,
        className,
        delay = DEFAULT_PROPS.delay,
        placement = DEFAULT_PROPS.placement,
        forceOpen = DEFAULT_PROPS.forceOpen,
        ...forwardedProps
    } = props;
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
