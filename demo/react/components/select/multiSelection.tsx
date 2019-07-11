import React from 'react';

import { Select, Theme } from 'LumX';

import { CHOICES, LABEL, PLACEHOLDER } from './constants';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Select>s.
 *
 * @param theme The theme to use to display this demo.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Select label={LABEL} multiple={true} placeholder={PLACEHOLDER} choices={CHOICES} theme={theme} />
);

/////////////////////////////

export default {
    view: DemoComponent,
};
