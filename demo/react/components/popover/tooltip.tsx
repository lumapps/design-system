import React, { CSSProperties, ReactElement } from 'react';

import { Popover, PopperPlacement } from 'LumX';

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
    fontSize: '12px',
    padding: '5px',
};

const createDemoAnchor = (placement: string): ReactElement => {
    return <div style={demoAnchorStyle}>{`Hovering will show a tooltip using placement : ${placement}`}</div>;
};

const createPopper = (): ReactElement => {
    return <div style={demoPopperStyle}>{`Tooltip`}</div>;
};

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const placementDemo: string[] = [
        PopperPlacement.LEFT,
        PopperPlacement.TOP,
        PopperPlacement.RIGHT,
        PopperPlacement.BOTTOM,
    ];

    return (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-around ' }}>
            {placementDemo.map(
                (placement: string): ReactElement => (
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
