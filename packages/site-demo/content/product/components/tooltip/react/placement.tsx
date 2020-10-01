import { mdiPrinter } from '@lumx/icons';
import { Alignment, Emphasis, FlexBox, IconButton, Orientation, Placement, Tooltip } from '@lumx/react';
import React from 'react';

const App = () => {
    return (
        <FlexBox orientation={Orientation.horizontal} vAlign={Alignment.center}>
            <div className="lumx-spacing-margin-tiny">
                <Tooltip label="Print" placement={Placement.BOTTOM} forceOpen>
                    <IconButton emphasis={Emphasis.medium} icon={mdiPrinter} />
                </Tooltip>
            </div>

            <div className="lumx-spacing-margin-tiny">
                <Tooltip label="Print" placement={Placement.TOP} forceOpen>
                    <IconButton emphasis={Emphasis.medium} icon={mdiPrinter} />
                </Tooltip>
            </div>

            <div className="lumx-spacing-margin-tiny" style={{ paddingLeft: 56 }}>
                <Tooltip label="Print" placement={Placement.LEFT} forceOpen>
                    <IconButton emphasis={Emphasis.medium} icon={mdiPrinter} />
                </Tooltip>
            </div>

            <div className="lumx-spacing-margin-tiny">
                <Tooltip label="Print" placement={Placement.RIGHT} forceOpen>
                    <IconButton emphasis={Emphasis.medium} icon={mdiPrinter} />
                </Tooltip>
            </div>
        </FlexBox>
    );
};

export default App;
