import { TableRow } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Table/TableRowStories';
import TableRowDefaultVue from './Stories/TableRowDefault.vue';

const { meta, ...stories } = setup({
    component: TableRow,
    decorators: { withCombinations },
    overrides: {
        Default: {
            render: withRender({ TableRowDefaultVue }),
        },
        AllStates: {
            render: withRender({ TableRowDefaultVue }),
            decorators: [
                withCombinations({
                    firstColStyle: { minWidth: 200 },
                    combinations: {
                        rows: {
                            Default: {},
                            Clickable: { isClickable: true },
                            Selected: { isSelected: true },
                            Disabled: { isDisabled: true },
                            'Clickable & Selected': { isClickable: true, isSelected: true },
                            'Clickable & Disabled': { isClickable: true, isDisabled: true },
                        },
                    },
                }),
            ],
        },
    },
});

export default {
    title: 'LumX components/table/TableRow',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllStates = { ...stories.AllStates };
