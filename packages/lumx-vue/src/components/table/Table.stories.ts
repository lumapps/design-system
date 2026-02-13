import { Table } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Table/Stories';
import TableDefaultVue from './Stories/TableDefault.vue';
import TableWithHeaderVue from './Stories/TableWithHeader.vue';

const { meta, ...stories } = setup({
    component: Table,
    overrides: {
        Default: {
            render: withRender({ TableDefaultVue }),
        },
        WithHeader: {
            render: withRender({ TableWithHeaderVue }),
        },
    },
});

export default {
    title: 'LumX components/table/Table',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithHeader = { ...stories.WithHeader };
