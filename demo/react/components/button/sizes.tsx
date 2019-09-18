import React, { ReactElement } from 'react';

import { Button, ButtonEmphasis, Size, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the all the <Button>s sizes.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <div className="mb+">
            <Button
                className="mr"
                size={Size.s}
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Small - <code>s</code>
                </div>
            </Button>

            <Button
                className="mr"
                size={Size.s}
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Small - <code>s</code>
                </div>
            </Button>

            <Button size={Size.s} theme={theme}>
                <div>
                    Small - <code>s</code>
                </div>
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                size={Size.m}
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>

            <Button
                className="mr"
                size={Size.m}
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>

            <Button size={Size.m} theme={theme}>
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>
        </div>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
