import { Toolbar } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Toolbar/Stories';
import ToolbarDefaultVue from './Stories/ToolbarDefault.vue';
import ToolbarWithBeforeVue from './Stories/ToolbarWithBefore.vue';
import ToolbarWithAfterVue from './Stories/ToolbarWithAfter.vue';
import ToolbarWithAllVue from './Stories/ToolbarWithAll.vue';

const { meta, ...stories } = setup({
    component: Toolbar,
    render: withRender({ ToolbarDefaultVue }, '{{ args.label }}'),
    overrides: {
        WithBefore: {
            render: withRender({ ToolbarWithBeforeVue }),
        },
        WithAfter: {
            render: withRender({ ToolbarWithAfterVue }),
        },
        WithAll: {
            render: withRender({ ToolbarWithAllVue }),
        },
    },
});

export default {
    title: 'LumX components/toolbar/Toolbar',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithBefore = { ...stories.WithBefore };
export const WithAfter = { ...stories.WithAfter };
export const WithAll = { ...stories.WithAll };
