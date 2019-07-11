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
        choices={CHOICES}
        label={LABEL}
        filter={filter}
        hasFilter={true}
        hasHelper={!CHOICES.length}
        helper={'No results'}
        isLoading={true}
        multiple={true}
        placeholder={PLACEHOLDER}
        theme={theme}
    />
);

/////////////////////////////

export default {
    view: DemoComponent,
};
