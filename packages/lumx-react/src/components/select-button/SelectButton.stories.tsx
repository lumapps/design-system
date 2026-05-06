/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import { mdiMenuDown } from '@lumx/icons';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup, FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';

import { SelectButton } from '.';
import { Chip } from '../chip';
import { Icon } from '../icon';

const { meta, ...stories } = setup({
    components: { SelectButton },
    decorators: { withValueOnChange, withCombinations },
});

export default {
    title: 'LumX components/select-button/SelectButton',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const WithSections = { ...stories.WithSections };
export const WithDescriptions = { ...stories.WithDescriptions };
export const Disabled = { ...stories.Disabled };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };
export const MultipleSelection = { ...stories.MultipleSelection };
export const MultipleWithPreselected = { ...stories.MultipleWithPreselected };
export const WithNbOptionMessage = { ...stories.WithNbOptionMessage };
export const LabelDisplayModes = { ...stories.LabelDisplayModes };

// ── Framework-specific stories (use React hooks for stateful behavior) ──

/** SelectButton with custom option rendering via the `renderOption` prop */
export const CustomRender = () => {
    const [value, setValue] = useState<Fruit>();

    return (
        <SelectButton
            as={Chip}
            label="Select a fruit"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            value={value}
            onChange={setValue}
            isClickable
            isSelected={!!value}
            after={<Icon icon={mdiMenuDown} />}
            renderOption={(fruit) => (
                <SelectButton.Option value={fruit.id}>
                    <strong>{fruit.name}</strong>
                </SelectButton.Option>
            )}
        />
    );
};
