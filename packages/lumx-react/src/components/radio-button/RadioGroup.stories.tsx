import { RadioButton, RadioGroup } from '@lumx/react';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'Radio Group' };

export const Simple = ({ theme }: any) => (
    <RadioGroup>
        <RadioButton
            checked
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Radio button with help 1"
            name="test2"
            theme={theme}
            value="lorem"
            onChange={noop}
        />

        <RadioButton
            disabled
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Radio button with help 2"
            name="test2"
            theme={theme}
            value="ipsum"
        />

        <RadioButton
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Radio button with help 3"
            name="test2"
            theme={theme}
            value="dolor"
            onChange={noop}
        />
    </RadioGroup>
);
