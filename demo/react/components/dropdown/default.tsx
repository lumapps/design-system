import React, { CSSProperties, Fragment, ReactNode } from 'react';

import { Button, Dropdown, Placements } from 'LumX';

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

const createToggleElement: (text?: string) => ReactNode = (text: string = 'Button'): ReactNode => {
    return <Button>{text}</Button>;
};

/////////////////////////////

/**
 * The demo for the default <Dropdown>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => (
    <Fragment>
        <div style={demoContainerStyle}>
            <Dropdown
                closeOnClick={true}
                escapeClose={true}
                offset={{ horizontal: 1, vertical: 1 }}
                overToggle={true}
                position={Placements.BOTTOM_START}
                toggleElement={createToggleElement('Simple Menu')}
            >
                <h1>Todo simple menu</h1>
            </Dropdown>

            <Dropdown
                closeOnClick={true}
                escapeClose={true}
                offset={{ horizontal: 1, vertical: 1 }}
                overToggle={true}
                position={Placements.BOTTOM_START}
                toggleElement={createToggleElement('Complex Menu')}
            >
                <h1>Todo complex menu</h1>
            </Dropdown>
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
