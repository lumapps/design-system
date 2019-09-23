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
            <pre>{`Adjust threshold: ${value}`}</pre>
            <Slider
                max={10}
                min={0}
                theme={theme}
                defaultValue={4}
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
