import { InputHelper } from '@lumx/vue';
import { Default as DefaultConfig } from '@lumx/core/js/components/InputHelper/Stories';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    ...DefaultConfig,
    args: {
        ...DefaultConfig.args,
        children: 'Some helper text',
    },
};

export const Default = {};
