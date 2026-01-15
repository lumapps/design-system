import { InputHelper, Kind } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { AllKinds as AllKindsStory, Default as DefaultConfig } from '@lumx/core/js/components/InputHelper/Stories';

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

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...AllKindsStory,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'kind', options: withUndefined(Kind) },
            },
        }),
    ],
};
