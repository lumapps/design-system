import React, { ReactElement } from 'react';

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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <Grid theme={theme} orientation={Orientation.vertical} hAlign={Alignment.center}>
            <GridItem order="1">
                <div className="lumx-spacing-padding lumx-theme-background-red-N">ItemA with order=1</div>
            </GridItem>
            <GridItem order="3">
                <div className="lumx-spacing-padding lumx-theme-background-green-N">ItemB with order=3</div>
            </GridItem>
            <GridItem order="2">
                <div className="lumx-spacing-padding lumx-theme-background-blue-N">ItemC with order=2</div>
            </GridItem>
        </Grid>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
