import { Alignment, Chip, FlexBox, Orientation, Placement, Popover, Size } from '@lumx/react';
import { RefObject, useRef } from 'react';

export const App = ({ theme }: any) => {
    const popovers: Array<[Placement, RefObject<any>]> = [
        [Placement.LEFT, useRef(null)],
        [Placement.TOP, useRef(null)],
        [Placement.BOTTOM, useRef(null)],
        [Placement.RIGHT, useRef(null)],
    ];

    return (
        <FlexBox style={{ padding: 80, gap: 128 }} orientation={Orientation.vertical}>
            {popovers.map(([placement, ref]) => (
                <FlexBox key={placement} fillSpace vAlign={Alignment.center} hAlign={Alignment.center}>
                    <Chip ref={ref} theme={theme} size={Size.s}>
                        {placement.toUpperCase()}
                    </Chip>

                    <Popover
                        isOpen
                        className="lumx-spacing-padding-huge"
                        theme={theme}
                        anchorRef={ref}
                        placement={placement}
                    >
                        Popover
                    </Popover>
                </FlexBox>
            ))}
        </FlexBox>
    );
};
