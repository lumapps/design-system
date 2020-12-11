import { Alignment, Grid, GridItem, Size, SkeletonTypography, Typography } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    return (
        <>
            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.display1} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-display1">Display 1</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.headline} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-headline">Headline</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.title} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-title">Title</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.subtitle2} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-subtitle2">Subtitle 2</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.subtitle1} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-subtitle1">Subtitle 1</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.body2} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-body2">Body 2</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.body1} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-body1">Body 1</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.caption} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-caption">Caption</span>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="8">
                    <SkeletonTypography theme={theme} typography={Typography.overline} />
                </GridItem>

                <GridItem width="4">
                    <span className="lumx-typography-overline">Overline</span>
                </GridItem>
            </Grid>
        </>
    );
};
