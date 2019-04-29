import React, { ReactNode, useRef, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { handleBasicClasses } from 'LumX/core/utils';

import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from 'react-popper';

const SHOW_HIDE_DELAY: number = 500;

// Margin applied when using the fillWidth / fillHeight props
const SAFE_ZONE: number = 8;

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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Popover`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
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
 * @param {any} inputValue The input to extract the boolean value from
 */
const unwrap: (inputValue: boolean | string | (() => boolean) | undefined) => boolean = (
    inputValue: boolean | string | (() => boolean) | undefined,
): boolean => {
    return typeof inputValue === 'function' ? inputValue() : Boolean(inputValue);
};

/**
 * Get the popover offset base on its placement.
 * @param {string}          placement       The prefered placement
 * @param {Placements}      popperPlacement The actual platform
 * @param {PopperOffsets}   popperOffset    An offset to be applied on the popper
 * @return {Position}                       The css position.
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
 * @param {boolean} fillHeight          Should the holder use full available height
 * @param {boolean} fillwidth           Should the holder use full available width
 * @param {string}  transform           The computed CSS transform
 * @param {boolean} matchAnchorWidth    Should the popper match the anchor width
 * @return {Size}                       The size of the popper holder
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
 * @return {React.ReactElement} The component.
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
    tooltipShowHideDelay,
    useTooltipMode = DEFAULT_PROPS.useTooltipMode,
}: PopoverProps): React.ReactElement => {
    const [autoShowPopper, setAutoShowPopper]: [boolean, (autoShowPopper: boolean) => void] = useState(Boolean(false));

    const autoShowDelayer: React.MutableRefObject<number> = useRef(0);

    function onMouseEnteredReference(): void {
        toggleAutoShowPopper(true);
    }

    function onMouseLeftReference(): void {
        toggleAutoShowPopper(false);
    }

    function toggleAutoShowPopper(visibility: boolean): void {
        clearTimeout(autoShowDelayer.current);
        if (unwrap(useTooltipMode)) {
            autoShowDelayer.current = setTimeout((): void => setAutoShowPopper(visibility), tooltipShowHideDelay);
        }
    }

    // tslint:disable-next-line: no-any
    const modifiers: any | undefined = {
        flip: { enabled: !lockFlip },
    };

    return (
        <Manager>
            <Reference>
                {({ ref }: ReferenceChildrenProps): ReactNode => (
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
                    {({ ref, style, ...others }: PopperChildrenProps): ReactNode => {
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
                                        prefix: CLASSNAME,
                                    }),
                                )}
                            >
                                {popperElement}
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
