import React from 'react';
import { ColorPalette, ColorVariant, Icon, TypographyCustom, TypographyInterface } from '@lumx/react';
import { mdiEarth, mdiHeart } from '@lumx/icons';
import { withResizableBox } from '@lumx/react/stories/withResizableBox';
import { Text } from './Text';

export default { title: 'LumX components/text/Text' };

export const Default = () => <Text as="p">Some text</Text>;

export const WithIcon = (args) => (
    <Text as="p" {...args}>
        Some text <Icon icon={mdiHeart} /> with icons <Icon icon={mdiEarth} />
    </Text>
);

export const LongText = (args) => (
    <Text as="p" {...args}>
        Some very very very very very very very very very long text
    </Text>
);
LongText.decorators = [withResizableBox()];

export const NoWrap = LongText.bind({});
NoWrap.args = { noWrap: true };
NoWrap.decorators = [withResizableBox()];

export const Truncate = LongText.bind({});
Truncate.args = { truncate: true };
Truncate.decorators = [withResizableBox()];

export const TruncateMultiline = LongText.bind({});
TruncateMultiline.args = { truncate: { lines: 2 } };
TruncateMultiline.decorators = [withResizableBox()];

export const AllTypography = () => {
    const typographies = [undefined, ...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
    return (
        <table>
            {typographies.map((typography) => (
                <tr key={typography}>
                    <td>{typography}</td>
                    <td>
                        <WithIcon typography={typography} />
                    </td>
                </tr>
            ))}
        </table>
    );
};

export const AllColor = () => {
    const colorVariants = [undefined, ...Object.values(ColorVariant)];
    const colors = [undefined, ...Object.values(ColorPalette)];
    return (
        <table style={{ borderCollapse: 'separate', borderSpacing: 5 }}>
            <tr>
                <td />
                {colorVariants.map((colorVariant) => (
                    <td key={colorVariant}>{colorVariant}</td>
                ))}
            </tr>
            {colors.map((color) => (
                <tr key={color}>
                    <td>{color}</td>
                    {colorVariants.map((colorVariant) => (
                        <td key={colorVariant}>
                            <WithIcon color={color} colorVariant={colorVariant} />
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};
