import { mdiDelete } from '@lumx/icons';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { iconArgType } from '@lumx/core/stories/controls/icons';

import { Kind } from '../../constants';

export const Default = {
    argTypes: {
        kind: getSelectArgType(Kind),
        hasBackground: { control: 'boolean' },
        icon: iconArgType,
    },
    args: { children: loremIpsum('tiny') },
};

/**
 * Default message
 */
export const Base = {};

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...Default,
};

/**
 * All `kind` variants with `hasBackground`
 */
export const AllKindsWithBackground = {
    ...AllKinds,
    args: {
        hasBackground: true,
    },
};

/**
 * With custom icon
 */
export const CustomIcon = {
    args: {
        icon: mdiDelete,
    },
};

/**
 * With close button (has background and kind info)
 */
export const ClosableMessage = {
    args: {
        'closeButtonProps.label': 'Close',
        hasBackground: true,
        kind: 'info',
    },
    argTypes: {
        'closeButtonProps.onClick': { action: true },
    },
};
