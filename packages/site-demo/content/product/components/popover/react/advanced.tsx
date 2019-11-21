import React from 'react';

import { Popover, Placement, Size, Button, Emphasis, Orientation, UserBlock, Theme, IconButton } from '@lumx/react';
import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

const App = ({ theme }) => {
    const demoPopoverHolderStyle = {
        display: 'flex',
        height: 250,
        justifyContent: 'center',
        paddingTop: 100,
    };

    const [isCardDisplayed, setCardDisplayed] = React.useState(false);
    let delayer;
    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    /**
     * Switch tooltip visibility
     * @param newVisibleState Tooltip visibility
     */
    const toggleCardDisplay = (newVisibleState) => {
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

    const offsets = { vertical: 20 };

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.TOP_START,
        anchorRef,
        popoverRef,
        isCardDisplayed,
        offsets,
    );

    const createSimpleAction = (theme) => (
        <Button
            emphasis={Emphasis.medium}
            color={theme === Theme.dark ? 'light' : undefined}
            size={Size.s}
            theme={theme}
        >
            Follow
        </Button>
    );

    const demoActions = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

    const createMultipleActions = (theme) => (
        <>
            {demoActions.map(
                (demoAction, idx) => (
                    <IconButton
                        key={`ubAction${idx}`}
                        emphasis={Emphasis.low}
                        color={theme === Theme.dark ? 'light' : undefined}
                        icon={demoAction}
                        theme={theme}
                    />
                ),
            )}
        </>
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
                    onMouseEnter={() => toggleCardDisplay(true)}
                    onMouseLeave={() => toggleCardDisplay(false)}
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

export default App;
