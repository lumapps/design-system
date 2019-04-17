// tslint:disable
import React, { Fragment, useState } from 'react';

import { Orientations } from 'LumX/components';

import {
    Button,
    ButtonEmphasises,
    ButtonSizes,
    ButtonThemes,
    IconButton,
    UserBlock,
    UserBlockSize,
    UserBlockTheme,
} from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

import { Popover } from 'react-popover';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: UserBlockTheme;
}

const demoFields: string[] = ['Creative developer', 'Denpasar'];

const createSimpleAction: React.FC<ButtonThemes> = (
    theme: ButtonThemes,
): any => ( // tslint:disable-line
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

const createMultipleActions: React.FC<ButtonThemes> = (
    theme: any, // tslint:disable-line
) => (
    <Fragment>
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
    </Fragment>
);

/////////////////////////////

// tslint:disable
/**
 * The demo for the default <UserBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [isCardDisplayed, setCardDisplayed] = useState(false);

    const popoverProps = {
        isOpen: isCardDisplayed,
        onOuterAction: () => setCardDisplayed(false),
        body: () => <div>hey</div>,
    };

    const target = (
        <UserBlock
            theme={theme}
            name="Guillaume Nachury"
            fields={['Bidouilleur', 'Meyzieu']}
            avatar={`http://i.pravatar.cc/139`}
            orientation={Orientations.horizontal}
            onMouseEnter={() => setCardDisplayed(true)}
            size={UserBlockSize.m}
        />
    );

    return <Fragment />;
};
/* tslint:enable. */
/////////////////////////////

export default {
    view: DemoComponent,
};
/*

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


*/
