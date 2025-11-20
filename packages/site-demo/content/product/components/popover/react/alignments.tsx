import { Chip, FlexBox, Orientation, Placement, Popover, Size } from '@lumx/react';
import { useRef } from 'react';

export const App = ({ theme }: any) => {
    const topStartAnchorRef = useRef(null);
    const topEndAnchorRef = useRef(null);

    return (
        <>
            <FlexBox style={{ marginTop: 80, gap: 128 }} orientation={Orientation.vertical}>
                <Chip ref={topStartAnchorRef} theme={theme} size={Size.s} style={{ placeSelf: 'flex-start' }}>
                    TOP_START
                </Chip>
                <Popover
                    isOpen
                    className="lumx-spacing-padding-huge"
                    theme={theme}
                    anchorRef={topStartAnchorRef}
                    placement={Placement.TOP_START}
                >
                    Popover aligned on start of the top side
                </Popover>
                <Chip ref={topEndAnchorRef} theme={theme} size={Size.s} style={{ placeSelf: 'flex-end' }}>
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
