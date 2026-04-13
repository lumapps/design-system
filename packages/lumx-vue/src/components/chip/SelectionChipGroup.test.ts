import { render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';
import BaseSelectionChipGroupTests from '@lumx/core/js/components/Chip/SelectionChipGroupTests';
import { mdiEarth } from '@lumx/icons';

import { Icon } from '../icon';
import { Chip, SelectionChipGroup } from '.';

const testOptions = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
];

const StatefulWrapper = defineComponent({
    setup() {
        const value = ref([...testOptions]);
        const onChange = (newValue?: any[]) => {
            value.value = newValue ?? [];
        };
        return () =>
            h(SelectionChipGroup, {
                value: value.value,
                getOptionId: 'id',
                getOptionName: 'name',
                label: 'Test chips',
                chipRemoveLabel: 'Remove',
                onChange,
            });
    },
});

describe('<SelectionChipGroup />', () => {
    const renderComponent = (props: any, options?: any) =>
        render(SelectionChipGroup, {
            ...options,
            props,
        });

    // Core tests
    BaseSelectionChipGroupTests({
        render: renderComponent,
        renderStateful: () => render(StatefulWrapper),
        screen,
    });

    describe('Vue', () => {
        it('should customize chips via the #chip scoped slot', () => {
            render(
                defineComponent({
                    components: { SelectionChipGroup, Chip, Icon },
                    setup: () => ({
                        props: {
                            value: testOptions,
                            getOptionId: 'id',
                            getOptionName: 'name',
                            label: 'Test',
                            chipRemoveLabel: 'Remove',
                        },
                        icon: mdiEarth,
                    }),
                    template: `
                        <SelectionChipGroup v-bind="props">
                            <template #chip="{ option }">
                                <Chip
                                    :children="'Custom: ' + option.name"
                                    :isDisabled="option.id === '2'"
                                    class="custom-class"
                                >
                                    <template #before>
                                        <Icon :icon="icon" size="xs" />
                                    </template>
                                </Chip>
                            </template>
                        </SelectionChipGroup>
                    `,
                }),
            );

            // Custom children
            expect(screen.getByText('Custom: Apricot')).toBeInTheDocument();
            expect(screen.getByText('Custom: Apple')).toBeInTheDocument();
            expect(screen.getByText('Custom: Banana')).toBeInTheDocument();

            // className merge
            const chip = screen.getByText('Custom: Apricot').closest('.lumx-chip');
            expect(chip).toHaveClass('lumx-selection-chip-group__chip');
            expect(chip).toHaveClass('custom-class');

            // Per-chip isDisabled
            const chips = screen.getAllByRole('option');
            expect(chips[0]).not.toHaveAttribute('aria-disabled');
            expect(chips[1]).toHaveAttribute('aria-disabled', 'true');
            expect(chips[2]).not.toHaveAttribute('aria-disabled');

            // Before slot content
            expect(chip?.querySelector('.lumx-icon')).toBeInTheDocument();
        });
    });
});
