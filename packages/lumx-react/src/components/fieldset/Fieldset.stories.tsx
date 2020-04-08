import React from 'react';

import { useBooleanState } from '@lumx/react/hooks';
import { text } from '@storybook/addon-knobs';

import { Emphasis, Fieldset, List, ListItem, RadioButton, RadioGroup, Select, TextField } from '@lumx/react';

export default { title: 'LumX components/Fieldset' };

const Headline = () => <p className="lumx-typography-headline">Headline</p>;
const Title = () => <p className="lumx-typography-title">Title</p>;
const Subtitle2 = () => <p className="lumx-typography-subtitle2">Subtitle2</p>;
const BasicTextField = ({ theme, ...props }: any) => {
    const [value, setValue] = React.useState('');
    return <TextField label="Textfield label" value={value} theme={theme} onChange={setValue} {...props} />;
};

export const lowEmphasisFieldset = ({ theme }: any) => (
    <Fieldset emphasis={Emphasis.low} legend={text('Legend', 'Fieldset')} theme={theme} />
);
export const mediumEmphasisFieldset = ({ theme }: any) => (
    <Fieldset emphasis={Emphasis.medium} legend={text('Legend', 'Fieldset')} theme={theme} />
);
export const highEmphasisFieldset = ({ theme }: any) => (
    <Fieldset emphasis={Emphasis.high} legend={text('Legend', 'Fieldset')} theme={theme} />
);

export const withLowEmphasisFieldset = ({ theme }: any) => {
    const legendText = text('Legend', 'Fieldset', 'Content');

    return (
        <>
            <Headline />
            <Title />
            <Subtitle2 />
            <Fieldset legend={legendText} theme={theme} hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
                <BasicTextField theme={theme} className="lumx-spacing-margin-top-regular" />
            </Fieldset>
            <Fieldset legend="Fieldset legend" hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
            </Fieldset>
        </>
    );
};

export const withMediumEmphasisFieldset = ({ theme }: any) => {
    const legendText = text('Legend', 'Fieldset', 'Content');

    return (
        <>
            <Headline />
            <Title />
            <Fieldset emphasis={Emphasis.medium} legend={legendText} theme={theme} hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
                <BasicTextField theme={theme} className="lumx-spacing-margin-top-regular" />
            </Fieldset>
            <Fieldset emphasis={Emphasis.medium} legend="Fieldset legend" hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
            </Fieldset>
        </>
    );
};

export const withHighEmphasisFieldset = ({ theme }: any) => {
    const legendText = text('Legend', 'Fieldset', 'Content');

    return (
        <>
            <Headline />
            <Fieldset emphasis={Emphasis.high} legend={legendText} theme={theme} hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
                <BasicTextField theme={theme} />
            </Fieldset>
            <Fieldset emphasis={Emphasis.high} legend="Fieldset legend" hasFirstInputWithElevation>
                <BasicTextField theme={theme} />
            </Fieldset>
        </>
    );
};

export const withTextfieldFieldset = ({ theme }: any) => (
    <Fieldset legend={text('Legend', 'Fieldset', 'Content')} theme={theme} hasFirstInputWithElevation>
        <BasicTextField theme={theme} />
        <BasicTextField theme={theme} />
    </Fieldset>
);

export const withTextfieldAndHelperFieldset = ({ theme }: any) => (
    <Fieldset
        legend={text('Legend', 'Fieldset', 'Content')}
        helper="I'm an amazing helper"
        theme={theme}
        hasFirstInputWithElevation
    >
        <BasicTextField theme={theme} />
        <BasicTextField theme={theme} />
    </Fieldset>
);

export const withRadioGroupFieldset = ({ theme }: any) => (
    <Fieldset legend={text('Legend', 'Fieldset', 'Content')} theme={theme}>
        <RadioGroup>
            <RadioButton checked label="Radio button 1" name="test1" theme={theme} value="lorem" />
            <RadioButton disabled label="Radio button 2" name="test1" theme={theme} value="ipsum" />
        </RadioGroup>
    </Fieldset>
);

export const withSelectFieldset = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const [values, setValues] = React.useState<string[]>([]);
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    const clearSelectedvalues = () => {
        setValues([]);
    };

    const onItemSelectedHandler = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }
        closeSelect();
        setValues([item]);
    };

    return (
        <Fieldset legend={text('Legend', 'Fieldset', 'Content')} theme={theme} hasFirstInputWithElevation>
            <Select
                isOpen={isOpen}
                value={values}
                onClear={clearSelectedvalues}
                label="Select label"
                theme={theme}
                onInputClick={toggleSelect}
                onDropdownClose={closeSelect}
            >
                <List isClickable={isOpen}>
                    {CHOICES.map((choice, index) => (
                        <ListItem
                            isClickable
                            isSelected={values.includes(choice)}
                            key={index}
                            onItemSelected={onItemSelectedHandler(choice)}
                        >
                            {choice}
                        </ListItem>
                    ))}
                </List>
            </Select>
        </Fieldset>
    );
};
