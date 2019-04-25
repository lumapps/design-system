// tslint:disable: jsx-no-lambda
import React, { Fragment, useState } from 'react';

import { Orientations } from 'LumX/components';

import {
    Button,
    ButtonEmphasises,
    ButtonSizes,
    ButtonThemes,
    IconButton,
    Placements,
    Popover,
    PopperOffsets,
    UserBlock,
    UserBlockSize,
    UserBlockTheme,
} from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: UserBlockTheme;
}

// tslint:disable-next-line: no-any
const createSimpleAction: React.FC<ButtonThemes> = (theme: ButtonThemes): any => (
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

// tslint:disable-next-line: no-any
const createMultipleActions: React.FC<ButtonThemes> = (theme: any): any => (
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
    // tslint:disable-next-line: typedef
    const [isCardDisplayed, setCardDisplayed] = useState(false);
    // tslint:disable-next-line: typedef
    let delayer: NodeJS.Timeout | null;
    // tslint:disable-next-line: typedef
    const anchorRef = React.createRef();

    function toggleCardDisplay(newVisibleState: boolean): void {
        // tslint:disable-next-line: early-exit
        if (!newVisibleState) {
            delayer = setTimeout(() => setCardDisplayed(false), 500);
        } else {
            if (delayer) {
                clearTimeout(delayer);
                delayer = null;
            }
            delayer = setTimeout(() => setCardDisplayed(true), 500);
        }
    }

    const anchor: React.ReactNode = (
        <UserBlock
            ref={anchorRef}
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

    const popper: React.ReactNode = (
        <div
            style={{
                backgroundColor: `white`,
                borderRadius: 2,
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.42)',
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
                simpleAction={createSimpleAction(theme)}
                multipleActions={createMultipleActions(theme)}
            />
        </div>
    );

    const offsets: PopperOffsets = { vertical: 20 };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: 250, paddingTop: 100 }}>
            <Popover
                anchorElement={anchor}
                popperOffset={offsets}
                showPopper={isCardDisplayed}
                popperElement={popper}
                popperPlacement={Placements.TOP_START}
            />
        </div>
    );
};
/////////////////////////////

export default {
    view: DemoComponent,
};
