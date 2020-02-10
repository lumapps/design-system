import { TextField } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'TextField' };

/**
 * TextField story
 * @return simple TextField.
 */
export const simpleTextField = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
    />
);

export const textFieldWithHelp = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
    />
);

export const textFieldWithError = ({ theme }: any) => (
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
