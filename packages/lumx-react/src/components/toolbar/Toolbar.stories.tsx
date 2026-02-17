import { Toolbar, Icon } from '@lumx/react';
import { mdiMenu, mdiMagnify, mdiDotsVertical } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/Toolbar/Stories';

const { meta, ...stories } = setup({
    component: Toolbar,
    overrides: {
        WithBefore: {
            args: {
                label: 'Page title',
                before: <Icon icon={mdiMenu} />,
            },
        },
        WithAfter: {
            args: {
                label: 'Page title',
                after: (
                    <>
                        <Icon icon={mdiMagnify} />
                        <Icon icon={mdiDotsVertical} />
                    </>
                ),
            },
        },
        WithAll: {
            args: {
                before: <Icon icon={mdiMenu} />,
                label: 'Page title',
                after: (
                    <>
                        <Icon icon={mdiMagnify} />
                        <Icon icon={mdiDotsVertical} />
                    </>
                ),
            },
        },
    },
});

export default {
    title: 'LumX components/toolbar/Toolbar',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithBefore = { ...stories.WithBefore };
export const WithAfter = { ...stories.WithAfter };
export const WithAll = { ...stories.WithAll };
