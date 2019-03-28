import React, { Fragment } from 'react';

import { Button, ButtonEmphasises, ButtonTheme, ButtonThemes, Icon, IconButton } from 'LumX';
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
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
                Left icon
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
                Left icon
            </Button>

            <Button theme={theme}>
                <Icon icon={mdiPencil} />
                Left icon
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                Right icon
                <Icon icon={mdiCheck} />
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                Right icon
                <Icon icon={mdiCheck} />
            </Button>

            <Button theme={theme}>
                Right icon
                <Icon icon={mdiCheck} />
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
                Both icons
                <Icon icon={mdiCheck} />
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
                Both icons
                <Icon icon={mdiCheck} />
            </Button>

            <Button theme={theme}>
                <Icon icon={mdiPencil} />
                Both icons
                <Icon icon={mdiCheck} />
            </Button>
        </div>

        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
            </Button>

            <Button theme={theme}>
                <Icon icon={mdiPencil} />
            </Button>
        </div>

        <div>
            <IconButton
                className="mr"
                emphasis={ButtonEmphasises.low}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
            </IconButton>

            <IconButton
                className="mr"
                emphasis={ButtonEmphasises.medium}
                color={theme === ButtonThemes.dark ? 'light' : undefined}
                theme={theme}
            >
                <Icon icon={mdiPencil} />
            </IconButton>

            <IconButton theme={theme}>
                <Icon icon={mdiPencil} />
            </IconButton>
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
