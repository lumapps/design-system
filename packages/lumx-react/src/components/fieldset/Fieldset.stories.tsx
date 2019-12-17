import React from 'react';

import { select, text } from '@storybook/addon-knobs';

import { FIELDSET_DEFAULT_PROPS, Fieldset, Size, TextField } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'Fieldset', decorators };

// tslint:disable-next-line: no-console
const action = (val: string) => console.log(val);

export const simpleFieldset = ({ theme }) => {
    const legendText = text('Legend', 'First block', 'Content');
    const topSpacing = select('Top Spacing', Size, FIELDSET_DEFAULT_PROPS.topSpacing, 'Style');
    const bottomSpacing = select('Bottom Spacing', Size, FIELDSET_DEFAULT_PROPS.bottomSpacing, 'Style');

    return (
        <>
            <Fieldset legend={legendText} topSpacing={topSpacing} bottomSpacing={bottomSpacing} theme={theme}>
                <TextField label="Login" theme={theme} value="" onChange={action} />
            </Fieldset>
            <Fieldset legend="Personal info" topSpacing={topSpacing} bottomSpacing={bottomSpacing} theme={theme}>
                <TextField label="First name" theme={theme} value="" onChange={action} />
                <TextField label="Last name" theme={theme} value="" onChange={action} />
            </Fieldset>
        </>
    );
};
