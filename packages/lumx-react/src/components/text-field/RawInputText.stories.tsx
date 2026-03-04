import { RawInputText } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/TextField/RawInputTextStories';

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
