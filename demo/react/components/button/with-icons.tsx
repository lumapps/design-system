import React, { ReactElement } from 'react';

import { Button, ButtonEmphasis, IconButton, Theme } from 'LumX';
import { mdiCheck, mdiPencil } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the <Button>s with icons and <IconButton>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <div className="mb+">
            <Button
                className="mr"
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            >
                Left icon
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
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
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Right icon
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
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
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                rightIcon={mdiCheck}
                theme={theme}
            >
                Both icons
            </Button>

            <Button
                className="mr"
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
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
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            />

            <Button
                className="mr"
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
                leftIcon={mdiPencil}
                theme={theme}
            />

            <Button leftIcon={mdiPencil} theme={theme} />
        </div>

        <div>
            <IconButton
                className="mr"
                emphasis={ButtonEmphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                icon={mdiPencil}
                theme={theme}
            />

            <IconButton
                className="mr"
                emphasis={ButtonEmphasis.medium}
                color={theme === Theme.dark ? 'light' : undefined}
                icon={mdiPencil}
                theme={theme}
            />

            <IconButton icon={mdiPencil} theme={theme} />
        </div>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
