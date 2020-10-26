import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, FlexBox, Icon, Link, Orientation, Size, Theme } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.s} className="lumx-spacing-margin-right-tiny" />
                <span className="lumx-typography-title">Link with Title typography</span>
            </FlexBox>
        </Link>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.s} className="lumx-spacing-margin-right-tiny" />
                <span className="lumx-typography-subtitle2">Link with Subtitle 2 typography</span>
            </FlexBox>
        </Link>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                <span className="lumx-typography-body1">Link with Body 1 typography</span>
            </FlexBox>
        </Link>

        <Link color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xxs} className="lumx-spacing-margin-right-tiny" />
                <span className="lumx-typography-caption">Link with Caption typography</span>
            </FlexBox>
        </Link>
    </>
);
