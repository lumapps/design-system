import { useState } from 'react';

import { mdiFoodApple, mdiMenuDown } from '@lumx/icons';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup, FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';

import { SelectButton } from '.';
import { Combobox } from '../combobox';
import { IconButton } from '../button';
import { Chip } from '../chip';
import { Link } from '../link';
import { Icon } from '../icon';
import { FlexBox } from '../flex-box';

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
export const WithNbOptionMessage = { ...stories.WithNbOptionMessage };
export const LabelDisplayModes = { ...stories.LabelDisplayModes };

// ── Framework-specific stories (use React hooks for stateful behavior) ──

/** SelectButton with custom option rendering via the `renderOption` prop */
export const CustomOptionRender = () => {
    const [value, setValue] = useState<Fruit>();

    return (
        <SelectButton<Fruit>
            label="Select a fruit"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            getOptionDescription="description"
            value={value}
            onChange={setValue}
            renderOption={(fruit: Fruit) => (
                <Combobox.Option value={fruit.id}>
                    <strong>{fruit.name}</strong>
                </Combobox.Option>
            )}
        />
    );
};

/**
 * SelectButton with a custom trigger element via the polymorphic `as` prop.
 * Demonstrates three triggers side-by-side: `IconButton` (show-tooltip mode),
 * `Chip` (chevron via `after` slot), and `Link` (chevron via `rightIcon`).
 */
export const CustomButton = () => {
    const [iconValue, setIconValue] = useState<Fruit>();
    const [chipValue, setChipValue] = useState<Fruit>();
    const [linkValue, setLinkValue] = useState<Fruit>();

    return (
        <FlexBox orientation="horizontal" vAlign="space-around">
            <SelectButton<Fruit, typeof IconButton>
                as={IconButton}
                label="Select a fruit"
                labelDisplayMode="show-tooltip"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={iconValue}
                onChange={setIconValue}
                emphasis="medium"
                icon={mdiFoodApple}
                hideTooltip
                isSelected={!!iconValue}
            />

            <SelectButton<Fruit, typeof Chip>
                as={Chip}
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={chipValue}
                onChange={setChipValue}
                isClickable
                isSelected={!!chipValue}
                after={<Icon icon={mdiMenuDown} />}
            />

            <SelectButton<Fruit, typeof Link>
                as={Link}
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={linkValue}
                onChange={setLinkValue}
                rightIcon={mdiMenuDown}
            />
        </FlexBox>
    );
};
