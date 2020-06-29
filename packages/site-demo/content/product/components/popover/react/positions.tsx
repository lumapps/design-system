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
    const rightAnchorRef = React.useRef(null);
    const bottomAnchorRef = React.useRef(null);
    const leftAnchorRef = React.useRef(null);

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
                <Popover theme={theme} anchorRef={topAnchorRef} placement={Placement.TOP} isOpen>
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>

            <FlexBox fillSpace>
                <div style={demoPopoverHolderStyle}>
                    <Chip chipRef={rightAnchorRef} theme={theme} size={Size.s}>
                        RIGHT
                    </Chip>
                </div>
                <Popover theme={theme} anchorRef={rightAnchorRef} placement={Placement.RIGHT} isOpen>
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
                <Popover theme={theme} anchorRef={bottomAnchorRef} placement={Placement.BOTTOM} isOpen>
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
                <Popover theme={theme} anchorRef={leftAnchorRef} placement={Placement.LEFT} isOpen>
                    <div style={demoPopperStyle}>{'Popover'}</div>
                </Popover>
            </FlexBox>
        </FlexBox>
    );
};

export default App;
