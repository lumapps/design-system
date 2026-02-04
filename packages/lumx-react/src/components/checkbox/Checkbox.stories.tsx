import { Checkbox } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

import {
    Default as DefaultStory,
    Base as BaseStory,
    LabelAndHelper as LabelAndHelperStory,
    IntermediateState as IntermediateStateStory,
    Disabled as DisabledStory,
} from '@lumx/core/js/components/Checkbox/Stories';

export default {
    title: 'LumX components/checkbox/Checkbox',
    ...DefaultStory,
    component: Checkbox,
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
};

/**
 * Default checkbox
 */
export const Base = {
    ...BaseStory,
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    ...LabelAndHelperStory,
};

/**
 * With intermediate state
 */
export const IntermediateState = {
    ...IntermediateStateStory,
};

/**
 * Disabled
 */
export const Disabled = {
    ...DisabledStory,
    decorators: [
        withCombinations({
            combinations: {
                rows: {
                    disabled: { disabled: true },
                    'aria-disabled': { 'aria-disabled': true },
                },
            },
        }),
    ],
};
