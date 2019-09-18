import React, { CSSProperties, ReactElement, useRef, useState } from 'react';

import {
    Button,
    ButtonEmphasis,
    IconButton,
    Offset,
    Orientation,
    Placement,
    Popover,
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
    const anchorRef = useRef(null);
    const popoverRef = useRef(null);

    /**
     * Switch tooltip visibility
     * @param newVisibleState Tooltip visibility
     */
    const toggleCardDisplay = (newVisibleState: boolean): void => {
        if (delayer) {
            clearTimeout(delayer);
            delayer = null;
        }

        if (!newVisibleState) {
            delayer = setTimeout(() => setCardDisplayed(false), 0);
        } else {
            setCardDisplayed(true);
        }
    };

    const offsets: Offset = { vertical: 20 };

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.TOP_START,
        anchorRef,
        popoverRef,
        isCardDisplayed,
        offsets,
    );

    return (
        <>
            <div style={demoPopoverHolderStyle}>
                <UserBlock
                    userBlockRef={anchorRef}
                    theme={theme}
                    name="Guillaume Nachury"
                    fields={['Bidouilleur', 'Meyzieu']}
                    avatar={'http://i.pravatar.cc/139'}
                    orientation={Orientation.horizontal}
                    onMouseEnter={(): void => toggleCardDisplay(true)}
                    onMouseLeave={(): void => toggleCardDisplay(false)}
                    size={Size.m}
                />
            </div>
            <Popover popoverRef={popoverRef} isVisible={isVisible} popoverRect={computedPosition}>
                <div
                    style={{
                        display: 'flex',
                        flex: 'auto',
                        justifyContent: 'center',
                        paddingBottom: 16,
                        paddingTop: 25,
                        width: 213,
                        maxHeight: computedPosition.maxHeight,
                        overflow: 'auto',
                    }}
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
            </Popover>
        </>
    );
};
/////////////////////////////

export default {
    view: DemoComponent,
};
