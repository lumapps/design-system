import React from 'react';
import { ColorPalette, ColorVariant, TypographyCustom, TypographyInterface } from '@lumx/react';
import { Text } from './Text';

export default { title: 'LumX components/text/Text' };

export const Default = () => <Text>Some text</Text>;

export const AllTypography = () => {
    const typographies = [undefined, ...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
    return (
        <table>
            {typographies.map((typography) => (
                <tr key={typography}>
                    <td>{typography}</td>
                    <td>
                        <Text typography={typography}>Some text</Text>
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
                            <Text color={color} colorVariant={colorVariant}>
                                Some text
                            </Text>
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};
