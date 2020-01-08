import { TextField, TextFieldType } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'TextField', decorators };

/**
 * TextField story
 * @return simple TextField.
 */
export const simpleTextField = ({ theme }) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        type={TextFieldType.input}
        onChange={noop}
    />
);

export const textFieldWithHelp = ({ theme }) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
    />
);

export const textFieldWithError = ({ theme }) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
        hasError={true}
        error={
            <span>
                You must provide <strong>something</strong>
            </span>
        }
    />
);
