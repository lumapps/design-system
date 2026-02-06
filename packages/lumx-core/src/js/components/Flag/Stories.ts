import { mdiHeart } from '@lumx/icons';
import { ColorPalette } from '@lumx/core/js/constants';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup Flag stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations, withResizableBox },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withResizableBox';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: { color: colorArgType, icon: iconArgType },
            args: { label: 'Label' },
        },

        /** Default flag with label */
        Default: {},

        /** With icon */
        WithIcon: { args: { icon: mdiHeart } },

        /** All `color` variants */
        AllColors: {
            args: { icon: mdiHeart },
            argTypes: { color: { control: false } },
            decorators: [
                withCombinations({
                    combinations: {
                        cols: { key: 'color', options: withUndefined(ColorPalette) },
                    },
                }),
            ],
        },

        /** Truncate text option */
        Truncate: {
            args: { label: loremIpsum('tiny'), truncate: true },
            decorators: [withResizableBox()],
        },
    };
}
