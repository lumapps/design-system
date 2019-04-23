import React, { Fragment, useState } from 'react';

import { Placements, Popover } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
}

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return {React.ReactElement} The demo component.
 */
// tslint:disable-next-line: typedef
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    const [showPopper, setShowPopper] = useState(false);

    return (
        <div style={{ height: 200, display: 'flex', alignItems: 'center' }}>
            <Popover
                anchorElement={
                    <span onMouseEnter={() => setShowPopper(true)} onMouseLeave={() => setShowPopper(false)}>
                        Tooltip behavior
                    </span>
                }
                popperElement={showPopper ? <span>This is the content of the tooltip</span> : null}
                popperPlacement={Placements.BOTTOM}
            />
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
