import React, { ReactElement } from 'react';

import { Button, ButtonEmphasis, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Button>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <Button
            className="mr"
            emphasis={ButtonEmphasis.low}
            color={theme === Theme.dark ? 'light' : undefined}
            theme={theme}
        >
            Low emphasis
        </Button>

        <Button
            className="mr"
            emphasis={ButtonEmphasis.medium}
            color={theme === Theme.dark ? 'light' : undefined}
            theme={theme}
        >
            Medium emphasis
        </Button>

        <Button theme={theme}>High emphasis (default)</Button>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
