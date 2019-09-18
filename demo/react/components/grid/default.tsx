import React, { ReactElement } from 'react';

import { Alignment, Grid, GridItem, Orientation, Size, Theme } from 'LumX';

import './style.css';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Grid>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <pre>No gutter</pre>
        <Grid theme={theme} orientation={Orientation.horizontal} vAlign={Alignment.center} hAlign={Alignment.top}>
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-red-N">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-blue-N">width=3</div>
            </GridItem>
            <GridItem width="6">
                <div className="lumx-spacing-padding lumx-theme-background-green-N">width=6</div>
            </GridItem>
        </Grid>
        <p>
            <br />
        </p>
        <pre>Gutter Size.regular</pre>
        <Grid
            theme={theme}
            orientation={Orientation.horizontal}
            vAlign={Alignment.center}
            hAlign={Alignment.top}
            gutter={Size.regular}
        >
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-red-N">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-blue-N">width=3</div>
            </GridItem>
            <GridItem width="6">
                <div className="lumx-spacing-padding lumx-theme-background-green-N">width=6</div>
            </GridItem>
        </Grid>
        <p>
            <br />
        </p>
        <pre>Gutter Size.big</pre>
        <Grid
            theme={theme}
            orientation={Orientation.horizontal}
            vAlign={Alignment.center}
            hAlign={Alignment.top}
            gutter={Size.big}
        >
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-red-N">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-blue-N">width=3</div>
            </GridItem>
            <GridItem width="6">
                <div className="lumx-spacing-padding lumx-theme-background-green-N">width=6</div>
            </GridItem>
        </Grid>
        <p>
            <br />
        </p>
        <pre>Gutter Size.huge</pre>
        <Grid
            theme={theme}
            orientation={Orientation.horizontal}
            vAlign={Alignment.center}
            hAlign={Alignment.top}
            gutter={Size.huge}
        >
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-red-N">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="lumx-spacing-padding lumx-theme-background-blue-N">width=3</div>
            </GridItem>
            <GridItem width="6">
                <div className="lumx-spacing-padding lumx-theme-background-green-N">width=6</div>
            </GridItem>
        </Grid>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
