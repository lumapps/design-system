import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, FlexBox, Icon, Link, Orientation, Size, Theme } from '@lumx/react';

const App = ({ theme }: any) => (
    <>
        <div className="lumx-spacing-margin-bottom">
            <Link color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}>Default link</Link>
        </div>

        <div className="lumx-spacing-margin-bottom">
            <Link color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}>
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                    <span>Link with an icon</span>
                </FlexBox>
            </Link>
        </div>

        <Link color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}>
            <span className="lumx-typography-title">Link with Title typography</span>
        </Link>
    </>
);

export default App;
