// tslint:disable: jsx-no-lambda
import React, { CSSProperties, Fragment, ReactNode, useState } from 'react';

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

const demoPopoverHolderStyle: CSSProperties = {
    display: 'flex',
    height: 250,
    justifyContent: 'center',
    paddingTop: 100,
};

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

    /**
     * Switch tooltip visibility
     * @param {boolean} newVisibleState Tooltip visibility
     */
    const toggleCardDisplay: (newVisibleState: boolean) => void = (newVisibleState: boolean): void => {
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
    };

    const anchor: ReactNode = (
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

    const popper: ReactNode = (
        <div
            style={{
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
        <div style={demoPopoverHolderStyle}>
            <Popover
                anchorElement={anchor}
                popperOffset={offsets}
                showPopper={isCardDisplayed}
                popperElement={popper}
                popperPlacement={Placements.TOP_START}
                elevation={5}
            />
        </div>
    );
};
/////////////////////////////

export default {
    view: DemoComponent,
};
