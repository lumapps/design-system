import React, { CSSProperties, ReactElement, useState } from 'react';

import {
    Button,
    ButtonEmphasis,
    IconButton,
    Orientation,
    Popover,
    PopperOffsets,
    PopperPlacement,
    Size,
    Theme,
    UserBlock,
} from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

const demoPopoverHolderStyle: CSSProperties = {
    display: 'flex',
    height: 250,
    justifyContent: 'center',
    paddingTop: 100,
};

const createSimpleAction = (theme: Theme): ReactElement => (
    <Button
        emphasis={ButtonEmphasis.medium}
        color={theme === Theme.dark ? 'light' : undefined}
        size={Size.s}
        theme={theme}
    >
        Follow
    </Button>
);

const demoActions: string[] = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

const createMultipleActions = (theme: Theme): ReactElement => (
    <>
        {demoActions.map(
            (demoAction: string, idx: number): IconButton => (
                <IconButton
                    key={`ubAction${idx}`}
                    emphasis={ButtonEmphasis.low}
                    color={theme === Theme.dark ? 'light' : undefined}
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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isCardDisplayed, setCardDisplayed] = useState(false);
    let delayer: NodeJS.Timeout | null;
    const anchorRef = React.createRef();

    /**
     * Switch tooltip visibility
     * @param newVisibleState Tooltip visibility
     */
    const toggleCardDisplay = (newVisibleState: boolean): void => {
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

    const anchor: ReactElement = (
        <UserBlock
            ref={anchorRef}
            theme={theme}
            name="Guillaume Nachury"
            fields={['Bidouilleur', 'Meyzieu']}
            avatar={'http://i.pravatar.cc/139'}
            orientation={Orientation.horizontal}
            onMouseEnter={(): void => toggleCardDisplay(true)}
            onMouseLeave={(): void => toggleCardDisplay(false)}
            size={Size.m}
        />
    );

    const popper: ReactElement = (
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
                orientation={Orientation.vertical}
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
                popperPlacement={PopperPlacement.TOP_START}
                elevation={5}
            />
        </div>
    );
};
/////////////////////////////

export default {
    view: DemoComponent,
};
