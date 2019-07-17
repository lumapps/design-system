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
        <Grid theme={theme} wrap orientation={Orientation.vertical} hAlign={Alignment.center}>
            <GridItem order="1">
                <div className="demo-grid-itemA">ItemA with order=1</div>
            </GridItem>
            <GridItem order="3">
                <div className="demo-grid-itemB">ItemB with order=3</div>
            </GridItem>
            <GridItem order="2">
                <div className="demo-grid-itemC">ItemC with order=2</div>
            </GridItem>
        </Grid>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
