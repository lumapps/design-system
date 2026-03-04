import { useRef } from 'react';
import { classNames } from '@lumx/core/js/utils';
import { Button, FlexBox, Popover } from '@lumx/react';

export default () => {
    const topStartAnchorRef = useRef(null);
    const topEndAnchorRef = useRef(null);
    return (
        <>
            <FlexBox style={{ marginTop: 80, gap: 128 }} orientation="vertical">
                <Button ref={topStartAnchorRef} size="s" style={{ placeSelf: 'flex-start' }} emphasis="medium">
                    TOP_START
                </Button>
                <Popover
                    isOpen
                    className={classNames.padding('huge')}
                    anchorRef={topStartAnchorRef}
                    placement="top-start"
                >
                    Popover aligned on start of the top side
                </Popover>
                <Button ref={topEndAnchorRef} size="s" style={{ placeSelf: 'flex-end' }} emphasis="medium">
                    TOP_END
                </Button>
            </FlexBox>
            <Popover isOpen className={classNames.padding('huge')} anchorRef={topEndAnchorRef} placement="top-end">
                Popover aligned on start of the top side
            </Popover>
        </>
    );
};
