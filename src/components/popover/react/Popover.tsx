import React, { ReactElement, ReactNode, useRef, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { handleBasicClasses } from 'LumX/core/utils';

import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from 'react-popper';

const SHOW_HIDE_DELAY = 500;

// Margin applied when using the fillWidth / fillHeight props
const SAFE_ZONE = 8;

// Reference to the anchor element
let anchorRef: HTMLDivElement | null;

const enum Placements {
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
type PopperPositions = Placements;

interface IPopperOffsets {
    vertical?: number;
    horizontal?: number;
}
type PopperOffsets = IPopperOffsets;

interface IPosition {
    top?: number;
    left?: number;
}
type Position = IPosition;

interface ISize {
    height?: number | string;
    width?: number | string;
}
type Size = ISize;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IPopoverProps extends IGenericProps {
    /* The reference element that will be used as the anchor */
    anchorElement: ReactNode;
    /* How high the component is flying */
    elevation?: number;
    /* The element that will be displayed flying above the UI */
    popperElement?: ReactNode;
    /* vertical and/or horizontal offsets that will be applied to the popper position */
    popperOffset?: PopperOffsets;
    /* Should the popper be displayed ? */
    showPopper?: boolean | (() => boolean);
    /* The prefered popper location against the anchor */
    popperPlacement?: PopperPositions | string;
    /* Use the popover as a tooltip engine => auto show/hide the popper when hovering the anchor */
    useTooltipMode?: boolean | (() => boolean);
    /* Customize the delay when showing / hiding the popper */
    tooltipShowHideDelay?: number | undefined;
    /* Force the popper width to match the anchor's */
    matchAnchorWidth?: boolean;
    /* Force the popper wrapper to fill the width */
    fillwidth?: boolean;
    /* Force the popper wrapper to fill the height */
    fillHeight?: boolean;
    /* Prevent the popper to be fliped i.e. stays at its reference placement  */
    lockFlip?: boolean;
}
type PopoverProps = IPopoverProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<PopoverProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    elevation: 3,
    lockFlip: false,
    tooltipShowHideDelay: SHOW_HIDE_DELAY,
    useTooltipMode: false,
};
/////////////////////////////

/**
 * Helper method that returns a simple boolean value from different source format.
 * @param inputValue The input to extract the boolean value from
 */
const unwrap = (inputValue: boolean | string | (() => boolean) | undefined): boolean => {
    return typeof inputValue === 'function' ? inputValue() : Boolean(inputValue);
};

/**
 * Get the popover offset base on its placement.
 * @param          placement       The prefered placement
 * @param      popperPlacement The actual platform
 * @param   popperOffset    An offset to be applied on the popper
 * @return                       The css position.
 */
function computeOffsets(
    placement: string,
    // tslint:disable-next-line: no-shadowed-variable
    popperPlacement: Placements | undefined,
    // tslint:disable-next-line: no-shadowed-variable
    popperOffset: PopperOffsets | undefined = { vertical: 0, horizontal: 0 },
): Position {
    const computedOffs: Position = {
        left: popperOffset.horizontal || 0,
        top: popperOffset.vertical || 0,
    };
    const offsetDir: number = placement !== popperPlacement ? -1 : 1;
    if ((popperPlacement as string).startsWith('auto')) {
        return computedOffs;
    }
    if (
        ((popperPlacement as string).startsWith('top') || (popperPlacement as string).startsWith('bottom')) &&
        popperOffset &&
        popperOffset.vertical
    ) {
        computedOffs.top = popperOffset.vertical * offsetDir;
    }
    if (
        ((popperPlacement as string).startsWith('left') || (popperPlacement as string).startsWith('right')) &&
        popperOffset &&
        popperOffset.horizontal
    ) {
        computedOffs.left = popperOffset.horizontal * offsetDir;
    }
    return computedOffs;
}

/**
 * Get the size for the popper holder
 * @param fillHeight          Should the holder use full available height
 * @param fillwidth           Should the holder use full available width
 * @param  transform           The computed CSS transform
 * @param matchAnchorWidth    Should the popper match the anchor width
 * @return                       The size of the popper holder
 */
// tslint:disable: no-shadowed-variable
function computeSize(
    fillHeight: boolean | undefined,
    fillwidth: boolean | undefined,
    transform: string | undefined,
    matchAnchorWidth: boolean | undefined,
): Size {
    const popperHolderSize: Size = {};
    // extract the x and y traslation values
    // tslint:disable-next-line: variable-name
    const _transform: string = transform || '';
    const [tx, ty]: number[] = _transform
        .substring(_transform.indexOf('(') + 1, _transform.indexOf(')'))
        .split(',')
        .map((trsl: string) => Number(trsl.replace('px', '')));

    const viewportWidth: number = window.innerWidth;
    const viewportHeight: number = window.innerHeight;

    // force the popper to match the width of the anchor element
    if (matchAnchorWidth && anchorRef) {
        // tslint:disable-next-line: no-bitwise
        popperHolderSize.width = `${anchorRef.getBoundingClientRect().width >> 0}px`;
    } else {
        if (fillHeight) {
            popperHolderSize.height = `${viewportHeight - (ty + SAFE_ZONE)}px`;
        }
        if (fillwidth) {
            popperHolderSize.width = `${viewportWidth - (tx + SAFE_ZONE)}px`;
        }
    }

    return popperHolderSize;
}

/**
 * This component manage the positionning of hovering / poping out components.
 * Basically it binds an anchor element and a popper element and regarding the space available on the screen
 * + the selected placement the popper elem. will be displayed.
 *
 * @return The component.
 */
const Popover: React.FC<PopoverProps> = ({
    anchorElement,
    elevation = DEFAULT_PROPS.elevation,
    fillHeight,
    fillwidth,
    lockFlip,
    matchAnchorWidth,
    popperElement,
    popperOffset,
    popperPlacement,
    showPopper,
    tooltipShowHideDelay = DEFAULT_PROPS.tooltipShowHideDelay,
    useTooltipMode = DEFAULT_PROPS.useTooltipMode,
}: PopoverProps): ReactElement => {
    const [autoShowPopper, setAutoShowPopper] = useState(false);

    const autoShowDelayer: React.MutableRefObject<number> = useRef(0);

    function onMouseEnteredReference(): void {
        toggleAutoShowPopper(true);
    }

    function onMouseLeftReference(): void {
        toggleAutoShowPopper(false);
    }

    /**
     * Drives the visibility of the popper/tooltip element.
     * @param visibility Whether the tooltip show be visible or not
     */
    function toggleAutoShowPopper(visibility: boolean): void {
        clearTimeout(autoShowDelayer.current);
        // tslint:disable-next-line: early-exit
        if (unwrap(useTooltipMode)) {
            if (!visibility) {
                setAutoShowPopper(visibility);
            } else {
                autoShowDelayer.current = setTimeout((): void => setAutoShowPopper(visibility), tooltipShowHideDelay);
            }
        }
    }

    // tslint:disable-next-line: no-any
    const modifiers: any | undefined = {
        arrow: {
            // eslint-disable-next-line id-blacklist
            element: `.lumx-tooltip__arrow`,
            enabled: true,
        },
        flip: { enabled: !lockFlip },
    };

    return (
        <Manager>
            <Reference>
                {({ ref }: ReferenceChildrenProps): ReactElement => (
                    <div
                        ref={(elm: HTMLDivElement | null): void => {
                            anchorRef = elm;
                            ref(elm);
                        }}
                        style={{ width: 'fit-content', height: 'fit-content' }}
                        onMouseEnter={onMouseEnteredReference}
                        onMouseLeave={onMouseLeftReference}
                    >
                        {anchorElement}
                    </div>
                )}
            </Reference>
            {(unwrap(showPopper) || (unwrap(useTooltipMode) && autoShowPopper)) && (
                <Popper placement={popperPlacement as Placements} modifiers={modifiers}>
                    {({ ref, style, arrowProps, ...others }: PopperChildrenProps): ReactElement => {
                        const computedOffsets: Position = popperPlacement
                            ? computeOffsets(others.placement, popperPlacement as Placements, popperOffset)
                            : {};
                        const computedSizes: Size = computeSize(
                            fillHeight,
                            fillwidth,
                            style.transform,
                            matchAnchorWidth,
                        );
                        return (
                            <div
                                ref={ref}
                                style={{ ...style, ...computedOffsets, ...computedSizes }}
                                className={classNames(
                                    handleBasicClasses({
                                        elevation: elevation && elevation > 5 ? 5 : elevation,
                                        prefix: useTooltipMode ? 'lumx-tooltip' : CLASSNAME,
                                    }),
                                )}
                                x-placement={popperPlacement}
                            >
                                {popperElement}
                                {useTooltipMode && (
                                    <div
                                        ref={arrowProps.ref}
                                        style={arrowProps.style}
                                        className="lumx-tooltip__arrow"
                                    />
                                )}
                            </div>
                        );
                    }}
                </Popper>
            )}
        </Manager>
    );
};
Popover.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Popover,
    PopoverProps,
    PopperPositions,
    Placements,
    IPopperOffsets,
    PopperOffsets,
    SHOW_HIDE_DELAY,
};
