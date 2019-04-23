// Tslint:disable.
import React, { Fragment, useRef, useState } from 'react';

import { Orientations } from 'LumX/components';

import {
    Button,
    ButtonEmphasises,
    ButtonSizes,
    ButtonThemes,
    IPopperOffsets,
    IconButton,
    Placements,
    Popover,
    UserBlock,
    UserBlockSize,
    UserBlockTheme,
} from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

import { Manager, Popper, Reference } from 'react-popper';

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
): any => ( // Tslint:disable-line.
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
    theme: any, // Tslint:disable-line.
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

// Tslint:disable.
/**
 * The demo for the default <UserBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [isCardDisplayed, setCardDisplayed] = useState(false);
    const delayer = useRef(null);

    const toggleCardDisplay = (newVisibleState) => {
        if (newVisibleState) {
            if (delayer.current) {
                clearTimeout(delayer.current);
                delayer.current = null;
            }
            setCardDisplayed(true);
        } else {
            delayer.current = setTimeout(() => setCardDisplayed(false), 200);
        }
    };

    const anchor = (
        <UserBlock
            theme={theme}
            name="Guillaume Nachury"
            fields={['Bidouilleur', 'Meyzieu']}
            avatar={'http://i.pravatar.cc/139'}
            orientation={Orientations.horizontal}
            onMouseEnter={(): void => toggleCardDisplay(true)}
            onMouseLeave={(): void => toggleCardDisplay(false)}
            size={UserBlockSize.m}
        />
    );

    const popper = (
        <div
            style={{
                backgroundColor: `white`,
                borderRadius: 2,
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.12)',
                display: 'flex',
                flex: 'auto',
                justifyContent: 'center',
                paddingBottom: 16,
                paddingTop: 25,
                width: 213,
            }}
            onMouseEnter={(): void => toggleCardDisplay(true)}
            onMouseLeave={(): void => toggleCardDisplay(false)}
        >
            <UserBlock
                theme={theme}
                name="Guillaume Nachury"
                fields={['Bidouilleur', 'Meyzieu']}
                avatar={'http://i.pravatar.cc/139'}
                orientation={Orientations.vertical}
                onClick={(): void => console.log('UserBlock clicked')}
                simpleAction={createSimpleAction(theme)}
                multipleActions={createMultipleActions(theme)}
            />
        </div>
    );

    const offsets: IPopperOffsets = { top: 20, left: 50 };
    return (
        <Fragment>
            <Popover anchorElement={anchor} popperElement={popper} popperPlacement={Placements.RIGHT} useTooltipMode />
        </Fragment>
    );
};
/* Tslint:enable. */
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
