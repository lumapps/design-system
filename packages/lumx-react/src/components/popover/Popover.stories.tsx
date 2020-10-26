import React from 'react';

import { Chip, FlexBox, Orientation, Placement, Popover, Size } from '@lumx/react';
import { boolean, select } from '@storybook/addon-knobs';

export default { title: 'LumX components/popover/Popover' };

const DEFAULT_PROPS = Popover.defaultProps as any;

export const positions = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 80,
        justifyContent: 'center',
        width: 100,
    };

    const demoPopoverHolderStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 132,
        justifyContent: 'center',
    };

    const topAnchorRef = React.useRef(null);
    const rightAnchorRef = React.useRef(null);
    const bottomAnchorRef = React.useRef(null);
    const leftAnchorRef = React.useRef(null);

    const hasArrow = boolean('hasArrow', DEFAULT_PROPS.hasArrow as any);
    const elevation: any = select('elevation', [5, 4, 3, 2, 1], DEFAULT_PROPS.elevation);

    return (
        <FlexBox
            className="lumx-spacing-margin-top-huge lumx-spacing-margin-bottom-huge"
            orientation={Orientation.horizontal}
        >
            <FlexBox fillSpace>
                <div style={demoPopoverHolderStyle}>
                    <Chip chipRef={topAnchorRef} theme={theme} size={Size.s}>
                        TOP
                    </Chip>
                </div>
                <Popover
                    theme={theme}
                    anchorRef={topAnchorRef}
                    placement={Placement.TOP}
                    isOpen
                    hasArrow={hasArrow}
                    elevation={elevation}
                >
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>

            <FlexBox fillSpace>
                <div style={demoPopoverHolderStyle}>
                    <Chip chipRef={rightAnchorRef} theme={theme} size={Size.s}>
                        RIGHT
                    </Chip>
                </div>
                <Popover
                    theme={theme}
                    anchorRef={rightAnchorRef}
                    placement={Placement.RIGHT}
                    isOpen
                    hasArrow={hasArrow}
                    elevation={elevation}
                >
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>

            <FlexBox fillSpace />

            <FlexBox fillSpace>
                <div style={demoPopoverHolderStyle}>
                    <Chip chipRef={bottomAnchorRef} theme={theme} size={Size.s}>
                        BOTTOM
                    </Chip>
                </div>
                <Popover
                    theme={theme}
                    anchorRef={bottomAnchorRef}
                    placement={Placement.BOTTOM}
                    isOpen
                    hasArrow={hasArrow}
                    elevation={elevation}
                >
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>

            <FlexBox fillSpace />

            <FlexBox fillSpace>
                <div style={demoPopoverHolderStyle}>
                    <Chip chipRef={leftAnchorRef} theme={theme} size={Size.s}>
                        LEFT
                    </Chip>
                </div>
                <Popover
                    theme={theme}
                    anchorRef={leftAnchorRef}
                    placement={Placement.LEFT}
                    isOpen
                    hasArrow={hasArrow}
                    elevation={elevation}
                >
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>
        </FlexBox>
    );
};

export const auto = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const container = {
        width: '200%',
        height: '2000px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip chipRef={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.AUTO} isOpen>
                <div style={demoPopperStyle}>{'Popover'}</div>
            </Popover>
        </div>
    );
};

export const top = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const container = {
        width: '200%',
        height: '2000px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip chipRef={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.TOP} isOpen>
                <div style={demoPopperStyle}>{'Popover'}</div>
            </Popover>
        </div>
    );
};
