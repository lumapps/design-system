import { TextField } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'TextField', decorators };

/**
 * TextField story
 * @return simple TextField.
 */
export const simpleTextField = () => (
    <TextField
        value={''}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        type="text"
    />
);
