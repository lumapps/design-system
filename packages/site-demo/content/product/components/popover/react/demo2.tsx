import { useRef, type RefObject } from 'react';
import { Chip, FlexBox, Popover, type Theme, type Placement } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const popovers: Array<[Placement, RefObject<any>]> = [
        ['left', useRef(null)],
        ['top', useRef(null)],
        ['bottom', useRef(null)],
        ['right', useRef(null)],
    ];
    return (
        <FlexBox style={{ padding: 80, gap: 128 }} orientation="vertical">
            {popovers.map(([placement, ref]) => (
                <FlexBox key={placement} fillSpace vAlign="center" hAlign="center">
                    <Chip ref={ref as any} theme={theme} size="s">
                        {placement.toUpperCase()}
                    </Chip>

                    <Popover
                        isOpen
                        className="lumx-spacing-padding-huge"
                        theme={theme}
                        anchorRef={ref as any}
                        placement={placement}
                    >
                        Popover
                    </Popover>
                </FlexBox>
            ))}
        </FlexBox>
    );
};
