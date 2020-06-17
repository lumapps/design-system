import React, { CSSProperties, RefObject, useEffect, useRef, useState, Ref } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import classNames from 'classnames';

import { Offset, Placement } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
}

/**
 * Defines the props of the component.
 */
interface TooltipProps extends OptionalTooltipProps {
    /** Label */
    label: string;
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
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

/**
 * Tooltip.
 *
 * @return The component.
 */
const Tooltip: React.FC<TooltipProps> = (props) => {
    const {
        label,
        children,
        className,
        delay = DEFAULT_PROPS.delay,
        placement = DEFAULT_PROPS.placement,
        ...forwardedProps
    } = props;
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const anchorRef = useRef(null);
    const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, OFFSET],
                },
            },
        ],
    });

    const actualPlacement = attributes?.popper?.['data-popper-placement'];
    const isOpen = useTooltipOpen({delay, anchorRef});

    return (
            <>
                <span ref={anchorRef}>
                    {children}
                </span>
                {isOpen && createPortal(
                    <div
                        {...forwardedProps}
                        ref={setPopperElement}
                        className={classNames(
                            className,
                            handleBasicClasses({ prefix: CLASSNAME }),
                            actualPlacement && `${CLASSNAME}--position-${actualPlacement}`,
                        )}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <div className={`${CLASSNAME}__arrow`} />
                        <div className={`${CLASSNAME}__inner`}>{label}</div>
                    </div>,
                    document.body,
                )}
            </>
        );
};
Tooltip.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, useTooltipOpen, Tooltip, TooltipPlacement, TooltipProps };
