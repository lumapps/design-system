import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/TextField/RawInputTextareaStories';

import { RawInputTextarea } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: RawInputTextarea,
    decorators: { withValueOnChange, withWrapper },
});

export default {
    title: 'LumX components/text-field/RawInputTextarea',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithPlaceholder = { ...stories.WithPlaceholder };
export const WithMinimumRows = { ...stories.WithMinimumRows };
