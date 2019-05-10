import React, { CSSProperties, ReactNode } from 'react';

import { Placements, Popover } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
}
const demoAnchorStyle: CSSProperties = {
    border: '1px solid grey',
    cursor: 'default',
    fontSize: '12px',
    padding: '5px',
    textAlign: 'center',
    width: '100px',
};

const demoPopperStyle: CSSProperties = {
    fontSize: '10px',
    padding: '5px',
};

const createDemoAnchor: (placement: string) => ReactNode = (placement: string): ReactNode => {
    return <div style={demoAnchorStyle}>{`Hovering will show a tooltip using placement : ${placement}`}</div>;
};

const createPopper: () => ReactNode = (): ReactNode => {
    return <div style={demoPopperStyle}>{`Tooltip`}</div>;
};

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return {React.ReactElement} The demo component.
 */
// tslint:disable-next-line: typedef
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    const placementDemo: string[] = [Placements.LEFT, Placements.TOP, Placements.RIGHT, Placements.BOTTOM];

    return (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-around ' }}>
            {placementDemo.map(
                (placement: string): React.ReactNode => (
                    <Popover
                        anchorElement={createDemoAnchor(placement)}
                        popperElement={createPopper()}
                        popperPlacement={placement}
                        useTooltipMode
                    />
                ),
            )}
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
