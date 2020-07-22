import { mdiHome } from '@lumx/icons/index';

import { Alignment, Button, Dropdown, FlexBox, IconButton, Orientation } from '@lumx/react';
import React, { useRef } from 'react';

export default { title: 'LumX components/dropdown/Dropdown' };

export const matchAnchorWithMinWidth = () => {
    const buttonRef1 = useRef<any>(null);
    const buttonRef2 = useRef<any>(null);
    return (
        <>
            <div>Match anchor width only if the dropdown is smaller</div>
            <FlexBox orientation={Orientation.horizontal}>
                <IconButton icon={mdiHome} buttonRef={buttonRef1} />
                <Dropdown anchorRef={buttonRef1} isOpen>
                    Big dropdown
                </Dropdown>

                <FlexBox marginAuto={Alignment.left}>
                    <Button buttonRef={buttonRef2}>Big button with long text</Button>
                </FlexBox>
                <Dropdown anchorRef={buttonRef2} isOpen>
                    Small Dropdown
                </Dropdown>
            </FlexBox>
        </>
    );
};
