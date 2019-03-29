import React, { Fragment } from 'react';

import { Button, ButtonEmphasises, ButtonSizes, ButtonTheme, ButtonThemes } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ButtonTheme;
}

/////////////////////////////

/**
 * The demo for the all the <Button>s sizes.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <div className="mb+">
            <Button
                className="mr"
                size={ButtonSizes.s}
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Small - <code>s</code>
                </div>
            </Button>

            <Button
                className="mr"
                size={ButtonSizes.s}
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Small - <code>s</code>
                </div>
            </Button>

            <Button size={ButtonSizes.s} theme={theme}>
                <div>
                    Small - <code>s</code>
                </div>
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                size={ButtonSizes.m}
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>

            <Button
                className="mr"
                size={ButtonSizes.m}
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>

            <Button size={ButtonSizes.m} theme={theme}>
                <div>
                    Medium - <code>m</code> (default)
                </div>
            </Button>
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
