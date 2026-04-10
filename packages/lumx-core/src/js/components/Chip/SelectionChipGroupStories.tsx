import type { SetupStoriesOptions } from '@lumx/core/stories/types';

const fruits = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
    { id: '4', name: 'Blueberry' },
    { id: '5', name: 'Lemon' },
    { id: '6', name: 'Orange' },
];
type FruitOption = (typeof fruits)[number];

export function setup({
    component: SelectionChipGroup,
    decorators: { withValueOnChange, withResizableBox },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withResizableBox';
}>) {
    const meta = {
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

    /** Default selection chip group */
    const Default = {};

    /** Disabled selection chip group */
    const Disabled = {
        args: { isDisabled: true },
    };

    /** Selection chip group with individually disabled chips */
    const IndividuallyDisabled = {
        args: {
            getChipProps: (option: FruitOption) => ({
                isDisabled: option.id === '2',
            }),
        },
    };

    /** Empty selection chip group */
    const Empty = {
        args: { value: [] },
    };

    /** Test in constrained space, chips should have text overflow ellipsis */
    const ConstrainedSpace = {
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

    return { meta, Default, Disabled, IndividuallyDisabled, Empty, ConstrainedSpace };
}
