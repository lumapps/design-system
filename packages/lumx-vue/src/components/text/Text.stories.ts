import { Text } from '@lumx/vue';

import {
    Default as DefaultConfig,
    Base,
    NoWrap,
    Truncate,
    TruncateMultiline as TruncateMultilineStory,
    AllWhiteSpace as AllWhiteSpaceStory,
    LongText as LongTextStory,
} from '@lumx/core/js/components/Text/Stories';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import TextTestUpdateTruncateTitleLabelVue from './Stories/TextTestUpdateTruncateTitleLabel.vue';
import TextWithIconVue from './Stories/TextWithIcon.vue';
import TextAllWhiteSpaceVue from './Stories/TextAllWhiteSpace.vue';
import TextAllTypographyVue from './Stories/TextAllTypography.vue';
import TextAllColorsVue from './Stories/TextAllColors.vue';

export default {
    title: 'LumX components/text/Text',
    component: Text,
    ...DefaultConfig,
    render: withRender({ Text }, '{{ args.children }}'),
};

export { Base, NoWrap, Truncate };

/**
 * Test the update of the `title` attribute when text overflows
 */
export const TestUpdateTruncateTitleLabel = {
    args: {
        as: 'p',
    },
    render: withRender({ TextTestUpdateTruncateTitleLabelVue }),
};

/**
 * Long text should wrap by default
 */
export const LongText = {
    ...LongTextStory,
    decorators: [withResizableBox()],
};

export const TruncateMultiline = {
    ...LongText,
    args: {
        ...LongText.args,
        ...TruncateMultilineStory.args,
    },
};

/**
 * Text containing icons (should match font size)
 */
export const WithIcon = {
    ...Base,
    render: withRender({ TextWithIconVue }),
};

export const AllWhiteSpace = {
    ...AllWhiteSpaceStory,
    render: withRender({ TextAllWhiteSpaceVue }, '{{ args.children }}'),
};

export const AllTypography = {
    ...Base,
    render: withRender({ TextAllTypographyVue }),
};

export const AllColors = {
    ...Base,
    render: withRender({ TextAllColorsVue }),
};
