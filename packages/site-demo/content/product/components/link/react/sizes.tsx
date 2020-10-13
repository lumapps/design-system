import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, FlexBox, Icon, Link, Orientation, Size, Theme } from '@lumx/react';

const App = ({ theme }: any) => (
    <>
        <div className="lumx-spacing-margin-bottom-big">
            <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <Icon icon={mdiPencil} size={Size.s} className="lumx-spacing-margin-right-tiny" />
                    <span className="lumx-typography-title">Link with Title typography</span>
                </FlexBox>
            </Link>
        </div>

        <div className="lumx-spacing-margin-bottom-big">
            <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <Icon icon={mdiPencil} size={Size.s} className="lumx-spacing-margin-right-tiny" />
                    <span className="lumx-typography-subtitle2">Link with Subtitle 2 typography</span>
                </FlexBox>
            </Link>
        </div>

        <div className="lumx-spacing-margin-bottom-big">
            <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                    <span className="lumx-typography-body1">Link with Body 1 typography</span>
                </FlexBox>
            </Link>
        </div>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xxs} className="lumx-spacing-margin-right-tiny" />
                <span className="lumx-typography-caption">Link with Caption typography</span>
            </FlexBox>
        </Link>
    </>
);

export default App;
