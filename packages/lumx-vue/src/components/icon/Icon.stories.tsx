import DefaultStory, { SizeAndShape as DefaultSizeAndShape } from '@lumx/core/js/components/Icon/Stories';

import { Icon } from '.';

export default {
    title: 'LumX components/icon/Icon',
    component: Icon,
    ...DefaultStory,
};

export const SizeAndShape = {
    ...DefaultSizeAndShape,
    argTypes: {
        hasShape: { control: false },
        size: { control: false },
    },
};
