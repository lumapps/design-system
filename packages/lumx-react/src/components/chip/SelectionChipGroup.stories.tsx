import { Chip, SelectionChipGroup } from '@lumx/react';
import { useState } from 'react';

export default {
    title: 'LumX components/chip/SelectionChipGroup',
    component: SelectionChipGroup,
    argTypes: {},
};

interface FruitOption {
    id: string;
    name: string;
    disabled?: boolean;
}

const fruits: FruitOption[] = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
    { id: '4', name: 'Blueberry' },
    { id: '5', name: 'Lemon' },
    { id: '6', name: 'Orange' },
];

const Template = (args: any) => {
    const [selectedFruits, setSelectedFruits] = useState<FruitOption[]>(args.value || []);

    return <SelectionChipGroup {...args} value={selectedFruits} onChange={setSelectedFruits} />;
};

/**
 * Default selection chip group
 */
export const Default = {
    render: Template,
    args: {
        value: [fruits[0], fruits[1], fruits[2]],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
    },
};

/**
 * Selection chip group with custom render
 */
export const CustomRender = {
    render: Template,
    args: {
        value: [fruits[0], fruits[1], fruits[2]],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
        renderChip: (option: FruitOption) => <Chip>🍎 {option.name}</Chip>,
    },
};

/**
 * Disabled selection chip group
 */
export const Disabled = {
    render: Template,
    args: {
        value: [fruits[0], fruits[1], fruits[2]],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
        isDisabled: true,
    },
};

/**
 * Selection chip group with individually disabled chips
 */
export const IndividuallyDisabled = {
    render: Template,
    args: {
        value: [fruits[0], fruits[1], fruits[2]],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
        renderChip: (option: FruitOption) => <Chip isDisabled={option.id === '2'}>{option.name}</Chip>,
    },
};

/**
 * Empty selection chip group
 */
export const Empty = {
    render: Template,
    args: {
        value: [],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
    },
};
