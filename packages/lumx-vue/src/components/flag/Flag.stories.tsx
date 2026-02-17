import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/Flag/Stories';

import { Flag } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Flag,
    render: ({ label, ...args }: any) => <Flag {...args}>{label}</Flag>,
    decorators: { withWrapper, withCombinations, withResizableBox },
});

export default {
    title: 'LumX components/flag/Flag',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithIcon = { ...stories.WithIcon };
export const AllColors = { ...stories.AllColors };
export const Truncate = { ...stories.Truncate };
