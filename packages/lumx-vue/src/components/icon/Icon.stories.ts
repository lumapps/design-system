import { Icon, Size } from '@lumx/vue';

import { Default as DefaultConfig } from '@lumx/core/js/components/Icon/Stories';
import { mdiEarHearing } from '@lumx/icons';

export default {
    component: Icon,
    args: Icon.defaultProps,
    title: 'LumX components/icon/Icon',
    ...DefaultConfig,
};

export const Default = {
    args: {
        icon: mdiEarHearing,
        size: Size.l,
    },
    ...DefaultConfig,
};
