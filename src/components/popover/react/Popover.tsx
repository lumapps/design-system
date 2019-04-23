import React, { useRef, useState } from 'react';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from 'react-popper';

import noop from 'lodash/noop';

const SHOW_HIDE_DELAY: number = 500;

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
    top?: number;
    left?: number;
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IPopoverProps extends IGenericProps {
    anchorElement: React.ReactNode;
    popperOffset?: IPopperOffsets;
    popperElement?: React.ReactNode;
    showPopper?: boolean | (() => boolean);
    popperPlacement?: PopperPositions;
    useTooltipMode?: boolean | (() => boolean);
    tooltipShowHideDelay?: number | undefined;
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
    tooltipShowHideDelay: SHOW_HIDE_DELAY,
    useTooltipMode: false,
};
/////////////////////////////

function unwrap(inputValue: boolean | string | (() => boolean) | undefined): boolean {
    return typeof inputValue === 'function' ? inputValue() : Boolean(inputValue);
}

/**
 * [Enter the description of the component here].
 *
 * @return {React.ReactElement} The component.
 */
const Popover: React.FC<PopoverProps> = ({
    anchorElement,
    popperElement,
    popperOffset,
    popperPlacement,
    useTooltipMode = DEFAULT_PROPS.useTooltipMode,
    tooltipShowHideDelay,
    showPopper,
}: PopoverProps): React.ReactElement => {
    const [autoShowPopper, setAutoShowPopper]: [boolean, (autoShowPopper: boolean) => void] = useState(Boolean(false));

    // tslint:disable-next-line: typedef
    const autoShowDelayer = useRef();

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

    return (
        <Manager>
            <Reference>
                {({ ref }: ReferenceChildrenProps): React.ReactNode => (
                    <div
                        ref={ref}
                        style={{ width: 'fit-content', height: 'fit-content' }}
                        onMouseEnter={onMouseEnteredReference}
                        onMouseLeave={onMouseLeftReference}
                    >
                        {anchorElement}
                    </div>
                )}
            </Reference>
            {(unwrap(showPopper) || (unwrap(useTooltipMode) && autoShowPopper)) && (
                <Popper placement={popperPlacement}>
                    {({ ref, style }: PopperChildrenProps): React.ReactNode => {
                        return (
                            <div ref={ref} style={{ ...style, ...popperOffset }}>
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
    SHOW_HIDE_DELAY,
};
