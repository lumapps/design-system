import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from './RawInputText';

export function setup({
    component: RawInputText,
    decorators: { withValueOnChange, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withWrapper';
}>) {
    const meta = {
        component: RawInputText,
        args: DEFAULT_PROPS,
        decorators: [withValueOnChange(), withWrapper({ style: { border: '1px dashed red' } })],
    };

    /** Default raw input */
    const Default = {};

    /** With placeholder text */
    const WithPlaceholder = {
        args: {
            placeholder: 'Input placeholder',
        },
    };

    return {
        meta,
        Default,
        WithPlaceholder,
    };
}
