import { Icon, Toolbar } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Toolbar/Stories';

const { meta, ...stories } = setup({
    component: Toolbar,
    components: { Icon },
    render: ({ label, before, after, ...args }: any) => (
        <Toolbar {...args}>
            {{
                default: label ? () => label : undefined,
                before: before ? () => before : undefined,
                after: after ? () => after : undefined,
            }}
        </Toolbar>
    ),
});

export default {
    title: 'LumX components/toolbar/Toolbar',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithBefore = { ...stories.WithBefore };
export const WithAfter = { ...stories.WithAfter };
export const WithAll = { ...stories.WithAll };
