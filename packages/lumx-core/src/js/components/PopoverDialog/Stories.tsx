import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Core stories for the PopoverDialog component.
 *
 * Stories are interactive (open/close state, focus trap, etc.) and require
 * framework-specific rendering for anchor refs and state management.
 * A `render` function is provided per framework to handle this.
 *
 * The render function receives all args, which can include:
 * - `label`: Accessible label for the dialog (aria-label)
 * - Any other PopoverDialog props
 */
export function setup({ component: PopoverDialog, render }: SetupStoriesOptions) {
    const meta = {
        component: PopoverDialog,
        render,
        parameters: { chromatic: { disableSnapshot: true } },
        tags: ['!snapshot'],
        argTypes: {
            anchorRef: { control: false },
            children: { control: false },
        },
    };

    /** Example PopoverDialog using a button as a trigger */
    const WithButtonTrigger = {};

    /** Example PopoverDialog using an icon button as a trigger */
    const WithIconButtonTrigger = {
        args: { label: 'Example popover' },
    };

    return { meta, WithButtonTrigger, WithIconButtonTrigger };
}
