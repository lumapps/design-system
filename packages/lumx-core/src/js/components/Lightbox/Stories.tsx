import { userEvent } from 'storybook/test';

import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { LANDSCAPE_IMAGES, LANDSCAPE_IMAGES_ALT } from '@lumx/core/stories/controls/image';

/**
 * Core stories for the Lightbox component.
 *
 * Lightbox is interactive (open/close state, focus trap, etc.) and requires
 * framework-specific rendering for refs and state management.
 * A `render` function is provided per framework to handle this.
 */
export function setup({
    component: Lightbox,
    render,
    components: { ImageBlock },
}: SetupStoriesOptions<{
    components: { ImageBlock: any };
}>) {
    const play = async ({ canvas }: any) => {
        const button = canvas.getByRole('button', { name: 'Open lightbox' });

        await userEvent.click(button);
    };

    const meta = {
        component: Lightbox,
        render,
        play,
        argTypes: {
            children: { control: false },
        },
    };

    /** Base Lightbox with image block */
    const Image = {
        render: ({ children, ...args }: any) =>
            render({
                ...args,
                children: (
                    <ImageBlock
                        align="center"
                        fillHeight
                        image={LANDSCAPE_IMAGES.landscape1}
                        alt={LANDSCAPE_IMAGES_ALT.landscape1}
                    />
                ),
            }),
        args: { 'aria-label': 'Fullscreen image' },
    };

    /** Lightbox with image block and close button */
    const WithCloseButton = {
        render: Image.render,
        args: { ...Image.args, closeButtonProps: { label: 'Close' } },
    };

    return { meta, Image, WithCloseButton, play };
}
