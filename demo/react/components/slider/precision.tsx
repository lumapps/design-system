import React, { ReactElement, useState } from 'react';

import { Slider, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Slider>s.
 *
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [value, setValue] = useState(0);
    const [value2, setValue2] = useState(0);
    return (
        <>
            <pre>{`Rocket science precision: ${value}`}</pre>
            <Slider
                max={10}
                min={0}
                theme={theme}
                precision={5}
                defaultValue={4.23765}
                onChange={(val: number): void => {
                    setValue(val);
                }}
            />
            <br />
            <pre>{`Change price: $${value2}`}</pre>
            <Slider
                max={120}
                min={0}
                theme={theme}
                precision={2}
                defaultValue={42.99}
                onChange={(val: number): void => {
                    setValue2(val);
                }}
            />
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
