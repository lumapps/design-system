import { useRef } from 'react';
import { Chip, Popover, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const anchorRef = useRef(null);
    return (
        <>
            <Chip style={{ marginBottom: 80 }} ref={anchorRef} theme={theme} size="s">
                Anchor
            </Chip>

            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={anchorRef}
                placement="bottom"
            >
                Popover
            </Popover>
        </>
    );
};
