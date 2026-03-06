import React from 'react';
import { Chip, IconButton, TextField, Typography } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/TextField/Stories';

const { meta, ...stories } = setup({
    component: TextField,
    components: { Chip, IconButton, Typography },
    decorators: { withValueOnChange, withCombinations },
});

export default {
    title: 'LumX components/text-field/TextField',
    args: TextField.defaultProps,
    ...meta,
};

export const Default = { ...stories.Default };
export const Placeholder = { ...stories.Placeholder };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const CustomLabelAndHelper = { ...stories.CustomLabelAndHelper };
export const NumberField = { ...stories.NumberField };
export const TextareaField = { ...stories.TextareaField };
export const Error = { ...stories.Error };
export const Valid = { ...stories.Valid };
export const MaxLength = { ...stories.MaxLength };
export const WithAfterElement = { ...stories.WithAfterElement };
export const WithChips = { ...stories.WithChips };
export const Disabled = { ...stories.Disabled };

/**
 * With clear button (React-specific story using useState)
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
