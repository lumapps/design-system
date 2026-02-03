import { ColorPalette, Flag } from '@lumx/react';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';

import {
    Default as DefaultConfig,
    Base,
    WithIcon as WithIconStory,
    AllColors as AllColorsStory,
    Truncate as TruncateStory,
} from '@lumx/core/js/components/Flag/Stories';

export default {
    ...DefaultConfig,
    title: 'LumX components/flag/Flag',
    component: Flag,
};

/**
 * Default flag with label
 */
export const Default = Base;

/**
 * With icon
 */
export const WithIcon = WithIconStory;

/**
 * All `color` variants
 */
export const AllColors = {
    ...AllColorsStory,
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'color', options: withUndefined(ColorPalette) },
            },
        }),
    ],
};

/**
 * Truncate text option
 */
export const Truncate = {
    ...TruncateStory,
    decorators: [withResizableBox()],
};
