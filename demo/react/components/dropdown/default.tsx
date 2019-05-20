import React, { CSSProperties, Fragment } from 'react';

import { Dropdown, Placements } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    // theme: DropdownTheme;
}

/////////////////////////////

/**
 * The demo for the default <Avatar>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => (
    <Fragment>
        <div style={demoContainerStyle}>
            <Dropdown
                closeOnClick={true}
                escapeClose={true}
                offset={{ horizontal: 10, vertical: 10 }}
                overToggle={true}
                position={Placements.RIGHT}
                toggleElement={<button type="button">Yolo</button>}
            >
                <h1>I'm in the popover</h1>
            </Dropdown>
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
