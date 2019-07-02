import React, { Fragment } from 'react';

import { Button, ButtonEmphasises, ButtonTheme, ButtonThemes, IconButton } from 'LumX';
import { mdiCheck, mdiPencil } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ButtonTheme;
}

/////////////////////////////

/**
 * The demo for the <Button>s with icons and <IconButton>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            >
                Left icon
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            >
                Left icon
            </Button>

            <Button leftIcon={mdiPencil} theme={theme}>
                Left icon
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Right icon
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Right icon
            </Button>

            <Button rightIcon={mdiCheck} theme={theme}>
                Right icon
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Both icons
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Both icons
            </Button>

            <Button leftIcon={mdiPencil} rightIcon={mdiCheck} theme={theme}>
                Both icons
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            />

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            />

            <Button leftIcon={mdiPencil} theme={theme} />
        </div>

        <div>
            <IconButton
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                icon={mdiPencil}
                theme={theme}
            />

            <IconButton
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                icon={mdiPencil}
                theme={theme}
            />

            <IconButton icon={mdiPencil} theme={theme} />
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
