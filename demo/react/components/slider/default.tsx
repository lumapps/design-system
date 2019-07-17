import React, { Fragment, useState } from 'react';

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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [value, setValue] = useState(0);
    return (
        <Fragment>
            <Slider
                max={20}
                min={2}
                precision={2}
                theme={theme}
                onChange={(val) => {
                    setValue(val);
                }}
            />
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
