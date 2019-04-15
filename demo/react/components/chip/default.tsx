// tslint:disable: jsx-no-lambda no-console

import React, { Fragment } from 'react';

import { Chip, ChipSizes, ChipTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ChipTheme;
}

/////////////////////////////

/**
 * The demo for the default <Chip>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Chip theme={theme} LabelComponent="Medium" />
        <Chip theme={theme} size={ChipSizes.s} LabelComponent="Small" />
        <Chip theme={theme} LabelComponent="Clickable" onClick={(): void => console.log('Chip component triggered.')} />
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
