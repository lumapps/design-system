import { InputHelper, Kind } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { AllKinds as AllKindsStory, Default } from '@lumx/core/js/components/InputHelper/Stories';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    args: {
        ...InputHelper.defaultProps,
        children: 'Some helper text',
    },
    ...Default,
};

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
