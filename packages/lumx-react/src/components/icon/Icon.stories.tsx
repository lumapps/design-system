import React, { Fragment } from 'react';

import { mdiEmail } from '@lumx/icons';
import { ColorPalette, ColorVariant, FlexBox, Icon, IconSizes, Size } from '@lumx/react';
import { Orientation } from '..';

export default { title: 'LumX components/icon/Icon', parameters: { hasGreyBackground: true } };

const iconSizes: Array<IconSizes | undefined> = [
    undefined,
    Size.xxs,
    Size.xs,
    Size.s,
    Size.m,
    Size.l,
    Size.xl,
    Size.xxl,
];

const TemplateSizeVariants = ({ hasShape, theme }: any) => (
    <FlexBox orientation={Orientation.horizontal}>
        {iconSizes.map((size) => (
            <FlexBox fillSpace key={`${size}`}>
                <h2>Size: {size || 'undefined'}</h2>
                <Icon icon={mdiEmail} size={size} hasShape={hasShape} theme={theme} />
            </FlexBox>
        ))}
    </FlexBox>
);

export const AllSize = ({ theme }: any) => TemplateSizeVariants({ theme });

export const AllSizeWithShape = ({ theme }: any) => TemplateSizeVariants({ theme, hasShape: true });

const TemplateColorVariants = ({ hasShape, theme }: any) => {
    const withUndefined = (a: any) => [undefined].concat(Object.values(a));
    return (
        <FlexBox orientation={Orientation.horizontal}>
            {withUndefined(ColorPalette).map((color) => (
                <FlexBox fillSpace key={`${color}`}>
                    <small key={`${color}`}>Color: {color || 'undefined'}</small>
                    <br />
                    {withUndefined(Object.values(ColorVariant).reverse()).map((colorVariant) => (
                        <Fragment key={`${colorVariant}`}>
                            {!colorVariant && (
                                <>
                                    <small>No theme</small>
                                    <Icon
                                        icon={mdiEmail}
                                        color={color}
                                        colorVariant={colorVariant}
                                        size="m"
                                        hasShape={hasShape}
                                    />
                                </>
                            )}
                            <small>Variant: {colorVariant || 'undefined'}</small>
                            <Icon
                                icon={mdiEmail}
                                color={color}
                                colorVariant={colorVariant}
                                size="m"
                                theme={theme}
                                hasShape={hasShape}
                            />
                        </Fragment>
                    ))}
                </FlexBox>
            ))}
        </FlexBox>
    );
};

export const AllColors = ({ theme }: any) => TemplateColorVariants({ theme });

export const AllColorsWithShape = ({ theme }: any) => TemplateColorVariants({ theme, hasShape: true });
