import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { ColorPalette, Grid, GridItem, Icon, IconSizes, Size } from '@lumx/react';

export default { title: 'Icon' };

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

export const allIcon = ({ theme }) => {
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
                                    <Grid>
                                        {iconColors.map((color) => {
                                            return (
                                                <GridItem>
                                                    {`Color: ${color}`}
                                                    <Icon
                                                        hasShape={hasShape}
                                                        icon={mdiEmail}
                                                        color={color}
                                                        size={size}
                                                        theme={theme}
                                                    />
                                                </GridItem>
                                            );
                                        })}
                                    </Grid>
                                </>
                            );
                        })}
                    </>
                );
            })}
        </>
    );
};
