import React, { ReactElement } from 'react';

import { Orientations } from 'LumX/components';

import { Button, ButtonEmphasises, ButtonSizes, ButtonThemes, IconButton, UserBlock, UserBlockTheme } from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: UserBlockTheme;
}

const demoFields: string[] = ['Creative developer', 'Denpasar'];

const createSimpleAction = (theme: ButtonThemes): ReactElement => (
    <Button
        emphasis={ButtonEmphasises.medium}
        color={theme === ButtonThemes.dark ? 'light' : undefined}
        size={ButtonSizes.s}
        theme={theme}
    >
        Follow
    </Button>
);

const demoActions: string[] = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

const createMultipleActions = (theme: ButtonThemes): ReactElement => (
    <>
        {demoActions.map(
            (demoAction: string, idx: number): IconButton => (
                <IconButton
                    key={`ubAction${idx}`}
                    emphasis={ButtonEmphasises.low}
                    color={theme === ButtonThemes.dark ? 'light' : undefined}
                    icon={demoAction}
                    theme={theme}
                />
            ),
        )}
    </>
);

/////////////////////////////

/**
 * The demo for the default <UserBlock>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={demoFields}
            avatar="http://i.pravatar.cc/128"
            orientation={Orientations.vertical}
            onMouseEnter={(): void => console.log('Mouse entered')}
            onMouseLeave={(): void => console.log('Mouse left')}
            onClick={(): void => console.log('UserBlock clicked')}
            simpleAction={createSimpleAction(theme)}
            multipleActions={createMultipleActions(theme)}
        />
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
