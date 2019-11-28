import React from 'react';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, Emphasis, IconButton, Orientation, Placement, Popover, Size, UserBlock } from '@lumx/react';

const App = () => {
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

    const createSimpleAction = () => (
        <Button emphasis={Emphasis.medium} size={Size.s}>
            Follow
        </Button>
    );

    const demoActions = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

    const createMultipleActions = () => (
        <>
            {demoActions.map((demoAction, idx) => (
                <IconButton key={`ubAction${idx}`} emphasis={Emphasis.low} icon={demoAction} />
            ))}
        </>
    );

    return (
        <>
            <div className="demo-grid">
                <UserBlock
                    userBlockRef={anchorRef}
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
                        name="Guillaume Nachury"
                        fields={['Bidouilleur', 'Meyzieu']}
                        avatar={'http://i.pravatar.cc/139'}
                        orientation={Orientation.vertical}
                        simpleAction={createSimpleAction()}
                        multipleActions={createMultipleActions()}
                    />
                </div>
            </Popover>
        </>
    );
};

export default App;
