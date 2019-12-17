import React from 'react';

import { text } from '@storybook/addon-knobs';
import { decorators } from '@lumx/react/story-block';

import { Fieldset, TextField } from '@lumx/react';

export default { title: 'Fieldset', decorators };

// tslint:disable-next-line: no-console
const action = (val: string) => console.log(val);

export const simpleFieldset = ({ theme }) => {
    const legendText = text('Legend', 'First block', 'Content');

    return (
        <>
            <Fieldset legend={legendText}>
                <TextField label="Login" theme={theme} value="" onChange={action} />
            </Fieldset>
            <Fieldset legend="Personal info" className="lumx-spacing-margin-top-huge">
                <TextField label="First name" theme={theme} value="" onChange={action} />
                <TextField label="Last name" theme={theme} value="" onChange={action} />
            </Fieldset>
        </>
    );
};
