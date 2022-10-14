import React from 'react';
import { mdiEarth } from '@lumx/icons';
import { ColorPalette, ColorVariant, Icon, Text, TypographyCustom, TypographyInterface } from '@lumx/react';
import { withResizableBox } from '@lumx/react/stories/withResizableBox';
import { InlineList } from '.';

const ALL_TYPOGRAPHY = [undefined, ...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];

export default {
    title: 'LumX components/inline-list/InlineList',
    argTypes: {
        typography: { control: 'select', options: ALL_TYPOGRAPHY },
        color: { control: 'select', options: ColorPalette },
        colorVariant: { control: 'select', options: ColorVariant },
    },
};

export const Default = (args: any) => (
    <InlineList as="p" {...args}>
        <span>Some text</span>
        <span>Some other text</span>
        <span>Some other other text</span>
    </InlineList>
);

export const MixedNoWrapAndTruncate = (args: any) => (
    <InlineList typography="body1" color="dark" colorVariant="L2" {...args} style={{ width: '100%' }}>
        <Text as="span" truncate>
            Very very very very very long text
        </Text>
        <Text as="span" noWrap>
            <Icon icon={mdiEarth} />
            Some text
        </Text>
        <Text as="span" truncate>
            Very very very very very long text
        </Text>
    </InlineList>
);
MixedNoWrapAndTruncate.decorators = [withResizableBox({ width: 400 })];
