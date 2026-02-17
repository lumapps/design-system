import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Text/Stories';

import { Icon, Text } from '@lumx/vue';
import TextTestUpdateTruncateTitleLabelVue from './Stories/TextTestUpdateTruncateTitleLabel.vue';

const { meta, ...stories } = setup({
    component: Text,
    components: { Icon },
    decorators: { withCombinations, withResizableBox },
    overrides: {
        TestUpdateTruncateTitleLabel: { render: withRender({ TextTestUpdateTruncateTitleLabelVue }) },
    },
});

export default {
    title: 'LumX components/text/Text',
    ...meta,
};

export const Base = { ...stories.Base };
export const LongText = { ...stories.LongText };
export const NoWrap = { ...stories.NoWrap };
export const AllWhiteSpace = { ...stories.AllWhiteSpace };
export const Truncate = { ...stories.Truncate };
export const TruncateMultiline = { ...stories.TruncateMultiline };
export const AllTypography = { ...stories.AllTypography };
export const AllColors = { ...stories.AllColors };
export const TestUpdateTruncateTitleLabel = { ...stories.TestUpdateTruncateTitleLabel };
export const WithIcon = { ...stories.WithIcon };
