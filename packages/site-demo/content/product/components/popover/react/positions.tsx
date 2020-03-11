import React from 'react';

import { Chip, FlexBox, Orientation, Placement, Popover, Size } from '@lumx/react';

const App = ({ theme }: any) => {
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
    const topPopoverRef = React.useRef(null);

    const { computedPosition: topComputedPosition, isVisible: topIsVisible } = Popover.useComputePosition(
        Placement.TOP,
        topAnchorRef,
        topPopoverRef,
        true,
    );

    const rightAnchorRef = React.useRef(null);
    const rightPopoverRef = React.useRef(null);

    const { computedPosition: rightComputedPosition, isVisible: rightIsVisible } = Popover.useComputePosition(
        Placement.RIGHT,
        rightAnchorRef,
        rightPopoverRef,
        true,
    );

    const bottomAnchorRef = React.useRef(null);
    const bottomPopoverRef = React.useRef(null);

    const { computedPosition: bottomComputedPosition, isVisible: bottomIsVisible } = Popover.useComputePosition(
        Placement.BOTTOM,
        bottomAnchorRef,
        bottomPopoverRef,
        true,
    );

    const leftAnchorRef = React.useRef(null);
    const leftPopoverRef = React.useRef(null);

    const { computedPosition: leftComputedPosition, isVisible: leftIsVisible } = Popover.useComputePosition(
        Placement.LEFT,
        leftAnchorRef,
        leftPopoverRef,
        true,
    );

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
                    popoverRect={topComputedPosition}
                    popoverRef={topPopoverRef}
                    isVisible={topIsVisible}
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
                    popoverRect={rightComputedPosition}
                    popoverRef={rightPopoverRef}
                    isVisible={rightIsVisible}
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
                    popoverRect={bottomComputedPosition}
                    popoverRef={bottomPopoverRef}
                    isVisible={bottomIsVisible}
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
                    popoverRect={leftComputedPosition}
                    popoverRef={leftPopoverRef}
                    isVisible={leftIsVisible}
                >
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>
        </FlexBox>
    );
};

export default App;
