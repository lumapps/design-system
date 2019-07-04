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

const filter = (): void => {
    // Empty.
};

/**
 * The demo for the default <Select>s.
 *
 * @param theme The theme to use to display this demo.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Select
        choices={choices}
        label="Select label"
        filter={filter}
        has-filter={true}
        hasHelper={!choices.length}
        helper={'No results'}
        isLoading={true}
        multiple={true}
        placeholder="Select values"
        theme={theme}
    />
);

/////////////////////////////

export default {
    view: DemoComponent,
};
