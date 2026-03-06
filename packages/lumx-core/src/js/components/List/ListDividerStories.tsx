import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup ListDivider stories for a specific framework (React or Vue).
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: ListDivider,
    components: { List },
    decorators: { withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withWrapper';
    components: { List: any };
}>) {
    const meta = {
        component: ListDivider,
        decorators: [withWrapper({}, List)],
    };

    /** Default divider */
    const Default = {};

    return { meta, Default };
}
