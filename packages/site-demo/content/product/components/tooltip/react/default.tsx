import React from 'react';

import { Button, Placement, Tooltip } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <Tooltip placement={Placement.TOP} label="Top Tooltip">
            <Button>Top</Button>
        </Tooltip>

        <Tooltip placement={Placement.RIGHT} label="Right Tooltip">
            <Button>Right</Button>
        </Tooltip>

        <Tooltip placement={Placement.BOTTOM} label="Bottom Tooltip">
            <Button>Bottom</Button>
        </Tooltip>

        <Tooltip placement={Placement.LEFT} label="Left Tooltip">
            <Button>Left</Button>
        </Tooltip>

        <Tooltip placement={Placement.BOTTOM} delay={2000} label="Tooltip with delay">
            <Button>Tooltip with delay</Button>
        </Tooltip>
    </div>
);

export default App;
