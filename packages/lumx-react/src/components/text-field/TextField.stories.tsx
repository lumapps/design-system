import { TextField } from '@lumx/react';
import { number, text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/TextField' };

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

export const simpleTextNumberField = ({ theme }: any) => (
    <TextField
        value={number('Value', 2)}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        theme={theme}
        onChange={noop}
        type="number"
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

export const TextArea = ({ theme }: any) => {
    const [value, setValue] = React.useState('my value');
    return (
        <TextField
            value={value}
            label={text('Label', 'I am the label')}
            placeholder={text('Placeholder', 'ex: A value')}
            multiline
            minimumRows={1}
            theme={theme}
            onChange={setValue}
            helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
        />
    );
};
export const TextAreaWith2Lines = ({ theme }: any) => {
    const [value, setValue] = React.useState('the value');
    return (
        <TextField
            value={value}
            label={text('Label', 'I am the label')}
            placeholder={text('Placeholder', 'ex: A value')}
            multiline
            minimumRows={2}
            theme={theme}
            onChange={setValue}
            helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
        />
    );
};

export const TextAreaWithManyLines = ({ theme }: any) => {
    const myvalue = `I
am
a
multiline
text`;
    const [value, setValue] = React.useState(myvalue);
    return (
        <TextField
            value={value}
            label={text('Label', 'I am the label')}
            placeholder={text('Placeholder', 'ex: A value')}
            multiline
            minimumRows={2}
            theme={theme}
            onChange={setValue}
            helper={<span>{text('Helper', 'ex: toto@acme.com')}</span>}
        />
    );
};

// Even with value set programmatically, the number of rows should be updated
export const TextAreaWithKnobValue = ({ theme }: any) => (
    <TextField
        value={text('Value', 'myvalue')}
        label={text('Label', 'I am the label')}
        placeholder={text('Placeholder', 'ex: A value')}
        multiline
        minimumRows={1}
        theme={theme}
        onChange={noop}
    />
);
