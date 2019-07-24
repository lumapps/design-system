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
    return (
        <>
            <pre>{`Change temperature: ${value}°C`}</pre>
            <Slider
                max={180}
                min={30}
                steps={5}
                theme={theme}
                defaultValue={40}
                onChange={(val: number): void => {
                    setValue(val);
                }}
            />
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
