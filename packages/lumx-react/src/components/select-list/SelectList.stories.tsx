import { useState } from 'react';
import { Icon } from '@lumx/react';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/SelectList/Stories';

import { SelectList } from '.';

const { meta, ...stories } = setup({
    components: { SelectList },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/select-list/SelectList',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const WithSections = { ...stories.WithSections };
export const MultipleSelection = { ...stories.MultipleSelection };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };
export const EmptyState = { ...stories.EmptyState };
export const Width = { ...stories.Width };

// ── Framework-specific stories (use React hooks for stateful behavior) ──

/** Custom option and section title rendering via the `renderOption` and `renderSectionTitle` props */
export const CustomRender = () => {
    const [value, setValue] = useState<Fruit>();

    return (
        <SelectList
            aria-label="Fruits"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            getSectionId="category"
            value={value}
            onChange={setValue}
            renderSectionTitle={(sectionId, options) => (
                <>
                    <Icon icon={options[0].categoryIcon} size="xs" />
                    {sectionId}
                </>
            )}
            renderOption={(fruit: Fruit) => (
                <SelectList.Option value={fruit.id} before={<Icon icon={fruit.icon} size="xs" />} />
            )}
        />
    );
};
