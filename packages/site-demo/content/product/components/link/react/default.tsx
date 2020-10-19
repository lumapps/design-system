import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, FlexBox, Icon, Link, Orientation, Size, Theme } from '@lumx/react';

const App = ({ theme }: any) => (
    <>
        <div className="lumx-spacing-margin-bottom-big">
            <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>Default link</Link>
        </div>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                <span>Link with an icon</span>
            </FlexBox>
        </Link>
    </>
);

export default App;
