import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, FlexBox, Icon, Link, Orientation, Size, Theme } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <>
        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>Default link</Link>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny"/>
                <span>Link with an icon</span>
            </FlexBox>
        </Link>
    </>
);

export default App;
