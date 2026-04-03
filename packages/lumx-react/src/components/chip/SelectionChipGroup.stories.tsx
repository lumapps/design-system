import { Chip, SelectionChipGroup } from '@lumx/react';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';

const fruits = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
    { id: '4', name: 'Blueberry' },
    { id: '5', name: 'Lemon' },
    { id: '6', name: 'Orange' },
];
type FruitOption = (typeof fruits)[number];

export default {
    title: 'LumX components/chip/SelectionChipGroup',
    component: SelectionChipGroup,
    args: {
        value: [fruits[0], fruits[1], fruits[2]],
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Selected fruits',
        chipRemoveLabel: 'Remove',
    },
    decorators: [withValueOnChange()],
};

/**
 * Default selection chip group
 */
export const Default = {};

/**
 * Selection chip group with custom render
 */
export const CustomRender = {
    args: {
        renderChip: (option: FruitOption) => <Chip>🍎 {option.name}</Chip>,
    },
};

/**
 * Disabled selection chip group
 */
export const Disabled = {
    args: {
        isDisabled: true,
    },
};

/**
 * Selection chip group with individually disabled chips
 */
export const IndividuallyDisabled = {
    args: {
        renderChip: (option: FruitOption) => <Chip isDisabled={option.id === '2'}>{option.name}</Chip>,
    },
};

/**
 * Empty selection chip group
 */
export const Empty = {
    args: {
        value: [],
    },
};

/**
 * Test in constrained space, chips should have text overflow ellipsis
 */
export const ConstrainedSpace = {
    decorators: [withResizableBox({ width: '400px', height: '100px' })],
    args: {
        value: [
            fruits[0],
            fruits[1],
            { name: 'Very very very very very long text' },
            { name: 'Very very very very very very very very very very very long text' },
        ],
    },
};
