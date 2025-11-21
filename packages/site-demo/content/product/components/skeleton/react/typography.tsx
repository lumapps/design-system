import { Alignment, Grid, GridItem, Size, SkeletonTypography, Typography } from '@lumx/react';

export const App = ({ theme }: any) => {
    return (
        <>
            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.display1} />
                </GridItem>

                <GridItem width="8">
                    <h1 className="lumx-typography-display1">Display 1</h1>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.headline} />
                </GridItem>

                <GridItem width="8">
                    <h2 className="lumx-typography-headline">Headline</h2>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.title} />
                </GridItem>

                <GridItem width="8">
                    <h3 className="lumx-typography-title">Title</h3>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.subtitle2} />
                </GridItem>

                <GridItem width="8">
                    <h4 className="lumx-typography-subtitle2">Subtitle 2</h4>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.subtitle1} />
                </GridItem>

                <GridItem width="8">
                    <h5 className="lumx-typography-subtitle1">Subtitle 1</h5>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.body2} />
                </GridItem>

                <GridItem width="8">
                    <p className="lumx-typography-body2">Body 2</p>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.body1} />
                </GridItem>

                <GridItem width="8">
                    <p className="lumx-typography-body1">Body 1</p>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.caption} />
                </GridItem>

                <GridItem width="4">
                    <p className="lumx-typography-caption">Caption</p>
                </GridItem>
            </Grid>

            <Grid gutter={Size.huge} hAlign={Alignment.center}>
                <GridItem width="4">
                    <SkeletonTypography theme={theme} typography={Typography.overline} />
                </GridItem>

                <GridItem width="8">
                    <p className="lumx-typography-overline">Overline</p>
                </GridItem>
            </Grid>
        </>
    );
};
