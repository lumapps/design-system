import { useRef } from 'react';
import { Chip, FlexBox, Popover, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const topStartAnchorRef = useRef(null);
    const topEndAnchorRef = useRef(null);
    return (
        <>
            <FlexBox style={{ marginTop: 80, gap: 128 }} orientation="vertical">
                <Chip ref={topStartAnchorRef} theme={theme} size="s" style={{ placeSelf: 'flex-start' }}>
                    TOP_START
                </Chip>
                <Popover
                    isOpen
                    className="lumx-spacing-padding-huge"
                    theme={theme}
                    anchorRef={topStartAnchorRef}
                    placement="top-start"
                >
                    Popover aligned on start of the top side
                </Popover>
                <Chip ref={topEndAnchorRef} theme={theme} size="s" style={{ placeSelf: 'flex-end' }}>
                    TOP_END
                </Chip>
            </FlexBox>
            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={topEndAnchorRef}
                placement="top-end"
            >
                Popover aligned on start of the top side
            </Popover>
        </>
    );
};
