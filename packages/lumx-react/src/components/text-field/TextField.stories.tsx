import { TextField } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'TextField' };

/**
 * TextField story
 * @return simple TextField.
 */
export const SimpleTextField = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
    />
);

export const TextFieldWithHelp = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
    />
);

export const TextFieldWithError = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
        hasError
        error={
            <span>
                You must provide <strong>something</strong>
            </span>
        }
    />
);
