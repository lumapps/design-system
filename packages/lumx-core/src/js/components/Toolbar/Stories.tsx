import { mdiMenu, mdiMagnify } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { DEFAULT_PROPS } from '.';

/**
 * Setup Toolbar stories for a specific framework (React or Vue).
 * Framework-specific components (Icon) are injected via `components`.
 */
export function setup({
    component: Toolbar,
    components: { Icon },
    render,
}: SetupStoriesOptions<{
    decorators?: never;
    components: { Icon: any };
}>) {
    const DefaultRender = render || ((args: any) => <Toolbar {...args} />);

    const meta = {
        component: Toolbar,
        render: DefaultRender,
        args: DEFAULT_PROPS,
    };

    /** Default toolbar with label */
    const Default = {
        render: () => <DefaultRender label="Toolbar label" />,
    };

    /** Toolbar with before content */
    const WithBefore = {
        render: () => <DefaultRender before={<Icon icon={mdiMenu} />} label="Page title" />,
    };

    /** Toolbar with after content */
    const WithAfter = {
        render: () => <DefaultRender after={<Icon icon={mdiMagnify} />} label="Page title" />,
    };

    /** Toolbar with all content areas */
    const WithAll = {
        render: () => (
            <DefaultRender before={<Icon icon={mdiMenu} />} after={<Icon icon={mdiMagnify} />} label="Page title" />
        ),
    };

    return { meta, Default, WithBefore, WithAfter, WithAll };
}
