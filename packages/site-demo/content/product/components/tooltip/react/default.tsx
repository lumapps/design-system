import React, { useRef } from 'react';

import { Button, Placement, Tooltip } from '@lumx/react';

const App = () => {
    const anchorRefTop = useRef(null);
    const anchorRefRight = useRef(null);
    const anchorRefBottom = useRef(null);
    const anchorRefLeft = useRef(null);
    const anchorRefDelay = useRef(null);

    return (
        <div className="demo-grid">
            <Button buttonRef={anchorRefTop}>Top</Button>
            <Button buttonRef={anchorRefRight}>Right</Button>
            <Button buttonRef={anchorRefBottom}>Bottom</Button>
            <Button buttonRef={anchorRefLeft}>Left</Button>
            <Button buttonRef={anchorRefDelay}>With 2s delay</Button>

            <Tooltip anchorRef={anchorRefTop} placement={Placement.TOP}>
                Top Tooltip
            </Tooltip>

            <Tooltip anchorRef={anchorRefRight} placement={Placement.RIGHT}>
                Right Tooltip
            </Tooltip>

            <Tooltip anchorRef={anchorRefBottom} placement={Placement.BOTTOM}>
                Bottom Tooltip
            </Tooltip>

            <Tooltip anchorRef={anchorRefLeft} placement={Placement.LEFT}>
                Left Tooltip
            </Tooltip>

            <Tooltip anchorRef={anchorRefDelay} delay={2000} placement={Placement.BOTTOM}>
                Tooltip with delay
            </Tooltip>
        </div>
    );
};

export default App;
