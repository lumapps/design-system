import { Alignment, Chip, FlexBox, Placement, Popover, Size } from '@lumx/react';
import React, { useRef } from 'react';

const App = ({ theme }: any) => {
    const topStartAnchorRef = useRef(null);
    const topEndAnchorRef = useRef(null);

    return (
        <>
            <FlexBox marginAuto={Alignment.right} style={{ marginTop: 80 }}>
                <Chip chipRef={topStartAnchorRef} theme={theme} size={Size.s}>
                    TOP_START
                </Chip>
            </FlexBox>
            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={topStartAnchorRef}
                placement={Placement.TOP_START}
            >
                Popover aligned on start of the top side
            </Popover>

            <FlexBox marginAuto={Alignment.left} style={{ marginTop: 80 }}>
                <Chip chipRef={topEndAnchorRef} theme={theme} size={Size.s}>
                    TOP_END
                </Chip>
            </FlexBox>
            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={topEndAnchorRef}
                placement={Placement.TOP_END}
            >
                Popover aligned on start of the top side
            </Popover>
        </>
    );
};

export default App;
