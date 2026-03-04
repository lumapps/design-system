import { useRef, type RefObject } from 'react';
import { classNames } from '@lumx/core/js/utils';
import { Button, FlexBox, Popover, type Placement } from '@lumx/react';

export default () => {
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
                    <Button ref={ref as any} size="s" emphasis="medium">
                        {placement.toUpperCase()}
                    </Button>

                    <Popover isOpen className={classNames.padding('huge')} anchorRef={ref as any} placement={placement}>
                        Popover
                    </Popover>
                </FlexBox>
            ))}
        </FlexBox>
    );
};
