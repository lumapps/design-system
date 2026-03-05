import { RawInputTextarea } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/TextField/RawInputTextareaStories';

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

// React-specific story using minimumRows prop (backward compatibility)
export const WithMinimumRows = {
    args: { minimumRows: 3 },
};
