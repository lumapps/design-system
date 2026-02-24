import { useRef } from 'react';
import { classNames } from '@lumx/core/js/utils';
import { Button, Popover } from '@lumx/react';

export default () => {
    const anchorRef = useRef(null);
    return (
        <>
            <Button style={{ marginBottom: 80 }} ref={anchorRef} size="s" emphasis="medium">
                Anchor
            </Button>

            <Popover
                isOpen
                className={classNames.padding('huge')}
                anchorRef={anchorRef}
                placement="right"
                offset={{
                    away: 30,
                    along: 60,
                }}
            >
                Popover
            </Popover>
        </>
    );
};
