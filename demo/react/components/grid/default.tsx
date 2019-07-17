import React, { Fragment } from 'react';

import { Alignment, Grid, GridItem, Orientation, Theme } from 'LumX';

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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <pre>No gutter</pre>
        <Grid theme={theme} wrap orientation={Orientation.horizontal} vAlign={Alignment.center} hAlign={Alignment.top}>
            <GridItem width="3">
                <div className="demo-grid-itemA">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="demo-grid-itemB">width=5</div>
            </GridItem>
            <GridItem width="6">
                <div className="demo-grid-itemC">width=4</div>
            </GridItem>
        </Grid>
        <p>
            <br />
        </p>
        <pre>Gutter = 8</pre>
        <Grid
            theme={theme}
            wrap
            orientation={Orientation.horizontal}
            vAlign={Alignment.center}
            hAlign={Alignment.top}
            gutter="8"
        >
            <GridItem width="2">
                <div className="demo-grid-itemA">width=2</div>
            </GridItem>
            <GridItem width="8">
                <div className="demo-grid-itemB">width=8</div>
            </GridItem>
            <GridItem width="2">
                <div className="demo-grid-itemC">width=2</div>
            </GridItem>
        </Grid>
        <p>
            <br />
        </p>
        <pre>Gutter = 24</pre>
        <Grid
            theme={theme}
            wrap
            orientation={Orientation.horizontal}
            vAlign={Alignment.center}
            hAlign={Alignment.top}
            gutter="24"
        >
            <GridItem width="3">
                <div className="demo-grid-itemA">width=3</div>
            </GridItem>
            <GridItem width="3">
                <div className="demo-grid-itemB">width=3</div>
            </GridItem>
            <GridItem width="6">
                <div className="demo-grid-itemC">width=6</div>
            </GridItem>
        </Grid>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
