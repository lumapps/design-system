import React from 'react';
import { mdiTranslate } from '@lumx/icons';
import { Chip, IconButton, TextField, Typography } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

export default {
    title: 'LumX components/text-field/TextField',
    component: TextField,
    args: TextField.defaultProps,
    argTypes: {
        clearButtonProps: { control: false },
        chips: { control: false },
        afterElement: { control: false },
        onClear: { action: true },
    },
    decorators: [withValueOnChange({})],
};

/**
 * Default text field
 */
export const Default = {
    args: {
        value: '',
    },
};

/**
 * With placeholder
 */
export const Placeholder = {
    args: {
        value: '',
        placeholder: 'Texfield placeholder',
    },
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    args: {
        ...Default.args,
        label: 'Textfield label',
        helper: loremIpsum('tiny'),
    },
};

/**
 * With custom label and helper
 */
export const CustomLabelAndHelper = {
    args: {
        ...Default.args,
        label: 'Textfield label',
        labelProps: {
            typography: Typography.subtitle1,
        },
        helper: loremIpsum('tiny'),
    },
};

/**
 * With clear button
 */
export const Clearable = () => {
    const inputRef = React.useRef(null);
    const [value, setValue] = React.useState('Some value');

    return (
        <TextField
            value={value}
            clearButtonProps={{ label: 'Clear' }}
            onChange={setValue}
            inputRef={inputRef}
            {...TextField.defaultProps}
        />
    );
};

/**
 * As number field
 */
export const NumberField = {
    args: {
        value: '0',
        type: 'number',
    },
};

/**
 * Multiline textarea
 */
export const TextareaField = {
    args: {
        value: loremIpsum('tiny'),
        multiline: true,
        minimumRows: 2,
    },
};

/**
 * Error state
 */
export const Error = {
    args: {
        ...LabelAndHelper.args,
        hasError: true,
        error: 'Error message',
    },
};

/**
 * Valid state
 */
export const Valid = {
    args: {
        ...LabelAndHelper.args,
        isValid: true,
    },
};

/**
 * Max length with character counter
 */
export const MaxLength = {
    args: {
        ...LabelAndHelper.args,
        value: 'Textfield value',
        maxLength: 195,
    },
};

/**
 * Custom element at the end
 */
export const WithAfterElement = {
    args: {
        value: '',
        afterElement: <IconButton label="translate" emphasis="medium" size="s" icon={mdiTranslate} />,
    },
};

/**
 * Chips at the start
 */
export const WithChips = {
    args: {
        value: '',
        chips: (
            <>
                <Chip size="s">Chip 1</Chip>
                <Chip size="s">Chip 2</Chip>
            </>
        ),
    },
};

/**
 * Disabled state
 */
export const Disabled = {
    args: {
        value: 'Some value',
        label: 'Label',
        helper: 'Helper',
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: {
                    disabled: { disabled: true },
                    'aria-disabled': { 'aria-disabled': true },
                },
            },
        }),
    ],
};
