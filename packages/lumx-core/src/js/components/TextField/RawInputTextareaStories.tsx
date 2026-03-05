import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from './RawInputTextarea';

export function setup({
    component: RawInputTextarea,
    decorators: { withValueOnChange, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withWrapper';
}>) {
    const meta = {
        component: RawInputTextarea,
        args: DEFAULT_PROPS,
        decorators: [withValueOnChange(), withWrapper({ style: { border: '1px dashed red' } })],
    };

    /** Default raw textarea */
    const Default = {};

    /** With custom minimum rows */
    const WithMinimumRows = {
        args: {
            rows: 3,
        },
    };

    /** With placeholder text */
    const WithPlaceholder = {
        args: {
            placeholder: 'Input placeholder',
        },
    };

    return {
        meta,
        Default,
        WithMinimumRows,
        WithPlaceholder,
    };
}
