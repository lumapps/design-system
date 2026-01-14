import { InputHelper, Kind } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
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
