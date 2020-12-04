import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { ColorPalette, FlexBox, Icon, IconSizes, Size } from '@lumx/react';
import { Orientation } from '..';

export default { title: 'LumX components/icon/Icon' };

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
const iconColors = [undefined, ...Object.values(ColorPalette)];
const iconShapes = [false, true];

export const AllIcon = ({ theme }: any) => {
    return (
        <>
            {iconShapes.map((hasShape) => {
                return (
                    <>
                        <h1>{`With shape: ${hasShape}`}</h1>
                        {iconSizes.map((size) => {
                            return (
                                <>
                                    <h2>{`Size: ${size}`}</h2>
                                    <FlexBox orientation={Orientation.horizontal}>
                                        {iconColors.map((color) => {
                                            return (
                                                <FlexBox fillSpace key={color}>
                                                    {`Color: ${color}`}
                                                    <Icon
                                                        hasShape={hasShape}
                                                        icon={mdiEmail}
                                                        color={color}
                                                        size={size}
                                                        theme={theme}
                                                    />
                                                </FlexBox>
                                            );
                                        })}
                                    </FlexBox>
                                </>
                            );
                        })}
                    </>
                );
            })}
        </>
    );
};
