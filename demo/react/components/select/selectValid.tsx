import React from 'react';

import { Select, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const choices = [];

/**
 * The demo for the default <Select>s.
 *
 * @param theme The theme to use to display this demo.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Select
        choices={choices}
        isClearable={true}
        isValid={true}
        label="Select label"
        placeholder="Select a value"
        theme={theme}
    />
);

/////////////////////////////

export default {
    view: DemoComponent,
};
