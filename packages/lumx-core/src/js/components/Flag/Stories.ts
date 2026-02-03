import { mdiHeart } from '@lumx/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';

export const Default = {
    title: 'LumX components/flag/Flag',
    argTypes: { color: colorArgType, icon: iconArgType },
    args: { label: 'Label' },
};

/**
 * Default flag with label
 */
export const Base = {};

/**
 * With icon
 */
export const WithIcon = { args: { icon: mdiHeart } };

/**
 * All `color` variants
 */
export const AllColors = {
    ...WithIcon,
    argTypes: { color: { control: false } },
};

/**
 * Truncate text option
 */
export const Truncate = {
    args: { label: loremIpsum('tiny'), truncate: true },
};
