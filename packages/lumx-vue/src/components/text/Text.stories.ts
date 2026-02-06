import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Text/Stories';

import { Text } from '@lumx/vue';
import TextTestUpdateTruncateTitleLabelVue from './Stories/TextTestUpdateTruncateTitleLabel.vue';
import TextWithIconVue from './Stories/TextWithIcon.vue';

const {
    meta,
    Base,
    LongText,
    NoWrap,
    AllWhiteSpace,
    Truncate,
    TruncateMultiline,
    AllTypography,
    AllColors,
    TestUpdateTruncateTitleLabel,
    WithIcon,
} = setup({
    component: Text,
    render: withRender({ Text }, '{{ args.children }}'),
    decorators: { withWrapper, withCombinations, withResizableBox },
    overrides: {
        TestUpdateTruncateTitleLabel: { render: withRender({ TextTestUpdateTruncateTitleLabelVue }) },
        WithIcon: { render: withRender({ TextWithIconVue }) },
    },
});

export default {
    title: 'LumX components/text/Text',
    ...meta,
};

export {
    Base,
    LongText,
    NoWrap,
    AllWhiteSpace,
    Truncate,
    TruncateMultiline,
    AllTypography,
    AllColors,
    TestUpdateTruncateTitleLabel,
    WithIcon,
};
