import React from 'react';
import { mdiTranslate } from '@lumx/icons/';
import { Emphasis, IconButton, Size, TextField } from '@lumx/react';
import { boolean, number, text } from '@storybook/addon-knobs';
import { buttonSize } from '@lumx/react/stories/knobs/buttonKnob';
import { emphasis } from '@lumx/react/stories/knobs/emphasisKnob';

export default { title: 'LumX components/text-field/TextField' };

export const TextField_ = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    return (
        <TextField
            value={value}
            onChange={onChange}
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            theme={theme}
        />
    );
};

export const Disabled = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    return (
        <TextField
            value={value}
            onChange={onChange}
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            theme={theme}
            isDisabled
        />
    );
};

export const Clearable = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    return (
        <TextField
            value={value}
            onChange={onChange}
            label={text('Label', 'Label')}
            clearButtonProps={{ label: 'Clear' }}
            theme={theme}
        />
    );
};

export const States = ({ theme }: any) => {
    const [value1, onChange1] = React.useState('Value');
    const [value2, onChange2] = React.useState('Value');
    return (
        <>
            <TextField
                label="Has error"
                hasError
                error="Error message"
                theme={theme}
                value={value1}
                onChange={onChange1}
            />
            <TextField label="Is valid" isValid theme={theme} value={value2} onChange={onChange2} />
        </>
    );
};

export const NumberField = ({ theme }: any) => {
    const [value, onChange] = React.useState('0');
    return <TextField value={value} onChange={onChange} label={text('Label', 'Label')} theme={theme} type="number" />;
};

export const WithHelper = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    return (
        <TextField
            value={value}
            onChange={onChange}
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            theme={theme}
            helper={<span>{text('Helper', 'Helper')}</span>}
        />
    );
};

export const TextArea = ({ theme }: any) => {
    const [value, setValue] = React.useState('Value');
    return (
        <TextField
            value={value}
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            multiline
            minimumRows={number('Minimum number of rows', 1, { min: 0, max: 100 })}
            theme={theme}
            onChange={setValue}
            helper={<span>{text('Helper', 'Helper')}</span>}
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
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            multiline
            minimumRows={number('Minimum number of rows', 2, { min: 0, max: 100 })}
            theme={theme}
            onChange={setValue}
            helper={<span>{text('Helper', 'Helper')}</span>}
        />
    );
};

export const WithAfterElement = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    const multiline = boolean('Multiline', true);
    const minimumRows = number('Minimum number of rows', 2, { min: 0, max: 100 });
    const isClearable = boolean('Clearable', true);
    const hasError = boolean('Has error', true);
    return (
        <TextField
            value={value}
            label={text('Label', 'Label')}
            placeholder={text('Placeholder', 'Placeholder')}
            theme={theme}
            onChange={onChange}
            multiline={multiline}
            minimumRows={minimumRows}
            hasError={hasError}
            maxLength={200}
            clearButtonProps={isClearable ? { label: 'Clear' } : undefined}
            helper={<span>{text('Helper', 'Helper')}</span>}
            afterElement={
                <IconButton
                    label="foo"
                    emphasis={emphasis('Button emphasis', Emphasis.medium, 'After element')}
                    size={buttonSize('Button size', Size.s, 'After element')}
                    icon={mdiTranslate}
                />
            }
        />
    );
};

export const WithMaxLengthNoLabel = ({ theme }: any) => {
    const [value, onChange] = React.useState('Value');
    const multiline = boolean('Multiline', true);
    const minimumRows = number('Minimum number of rows', 2, { min: 0, max: 100 });
    const isClearable = boolean('Clearable', true);
    const hasError = boolean('Has error', true);
    return (
        <TextField
            value={value}
            placeholder={text('Placeholder', 'Placeholder')}
            theme={theme}
            onChange={onChange}
            multiline={multiline}
            minimumRows={minimumRows}
            hasError={hasError}
            maxLength={200}
            clearButtonProps={isClearable ? { label: 'Clear' } : undefined}
            helper={<span>{text('Helper', 'Helper')}</span>}
            afterElement={
                <IconButton
                    label="foo"
                    emphasis={emphasis('Button emphasis', Emphasis.medium, 'After element')}
                    size={buttonSize('Button size', Size.s, 'After element')}
                    icon={mdiTranslate}
                />
            }
        />
    );
};
