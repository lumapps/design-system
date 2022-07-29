import React from 'react';
import { ColorPalette, ColorVariant, TypographyCustom, TypographyInterface } from '@lumx/react';
import { Text } from './Text';

export default { title: 'LumX components/text/Text' };

export const Default = () => <Text as="p">Some text</Text>;

const withResizableBox = (Story: any) => (
    <div
        style={{
            width: 150,
            height: 60,
            border: '1px solid red',
            resize: 'both',
            overflow: 'hidden',
        }}
    >
        <Story />
    </div>
);

export const Truncate = () => (
    <Text as="p" truncate>
        Some very very very long text
    </Text>
);
Truncate.decorators = [withResizableBox];

export const TruncateMultiline = () => (
    <Text as="p" truncate={{ lines: 2 }}>
        Some very very very very very very very very very long text
    </Text>
);
TruncateMultiline.decorators = [withResizableBox];

export const AllTypography = () => {
    const typographies = [undefined, ...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
    return (
        <table>
            {typographies.map((typography) => (
                <tr key={typography}>
                    <td>{typography}</td>
                    <td>
                        <Text as="p" typography={typography}>
                            Some text
                        </Text>
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
                            <Text as="p" color={color} colorVariant={colorVariant}>
                                Some text
                            </Text>
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};
