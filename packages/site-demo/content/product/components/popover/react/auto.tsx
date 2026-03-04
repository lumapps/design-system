import { useRef } from 'react';
import { classNames } from '@lumx/core/js/utils';
import { Button, Popover } from '@lumx/react';

export default () => {
    const anchorRef = useRef(null);
    return (
        <>
            <Button style={{ margin: 80 }} ref={anchorRef} size="s" emphasis="medium">
                Anchor
            </Button>

            <Popover isOpen className={classNames.padding('huge')} anchorRef={anchorRef} placement="auto">
                Popover
            </Popover>
        </>
    );
};
