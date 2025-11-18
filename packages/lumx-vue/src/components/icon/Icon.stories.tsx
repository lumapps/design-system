import { mdiEmail } from '@lumx/icons';

import { Icon } from '.';

export default {
    title: 'LumX components/icon/Icon',
    component: Icon,
    args: Icon.defaultProps,
    argTypes: {
        hasShape: { control: 'boolean' },
    },
};

/**
 * All combinations of size and shapeå
 */
export const SizeAndShape = {
    args: {
        icon: mdiEmail,
    },
    argTypes: {
        hasShape: { control: false },
        size: { control: false },
    },
};
