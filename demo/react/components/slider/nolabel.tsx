import React, { useState } from 'react';

import { ButtonEmphasis, IconButton, Size, Slider, Theme } from 'LumX';

import { mdiSpeaker, mdiSpeakerOff } from '@mdi/js';

import './style.css';

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
        <>
            <pre>{`Change volume : ${value}%`}</pre>
            <div className="demo-slider-row-container">
                <IconButton
                    emphasis={ButtonEmphasis.low}
                    size={Size.s}
                    theme={theme}
                    icon={mdiSpeakerOff}
                    color={theme === 'dark' ? 'light' : undefined}
                />
                <Slider
                    className="demo-slider-half-width"
                    max={100}
                    min={0}
                    hideMinMaxlabel
                    theme={theme}
                    defaultValue={20}
                    onChange={(val: number): void => {
                        setValue(val);
                    }}
                />
                <IconButton
                    emphasis={ButtonEmphasis.low}
                    size={Size.s}
                    theme={theme}
                    icon={mdiSpeaker}
                    color={theme === 'dark' ? 'light' : undefined}
                />
            </div>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
