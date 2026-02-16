import { TableRow } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Table/TableRowStories';
import TableRowDefaultVue from './Stories/TableRowDefault.vue';

const { meta, ...stories } = setup({
    component: TableRow,
    render: withRender({ TableRowDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/table/TableRow',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllStates = { ...stories.AllStates };
