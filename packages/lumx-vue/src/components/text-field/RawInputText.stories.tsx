import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/TextField/RawInputTextStories';

import { RawInputText } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: RawInputText,
    decorators: { withValueOnChange, withWrapper },
});

export default {
    title: 'LumX components/text-field/RawInputText',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithPlaceholder = { ...stories.WithPlaceholder };
