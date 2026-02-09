import { Checkbox } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import {
    Default as DefaultConfig,
    LabelAndHelper as LabelAndHelperStory,
    IntermediateState as IntermediateStateStory,
    Disabled as DisabledStory,
} from '@lumx/core/js/components/Checkbox/Stories';

export default {
    title: 'LumX components/checkbox/Checkbox',
    component: Checkbox,
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
    ...DefaultConfig,
};

/**
 * Default checkbox
 */
export const Default = {};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    ...LabelAndHelperStory,
    args: {
        label: 'Checkbox label',
        helper: loremIpsum('tiny'),
    },
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
    args: {
        label: 'Checkbox label',
        helper: 'Checkbox is disabled because...',
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: {
                    disabled: { isDisabled: true },
                    'aria-disabled': { 'aria-disabled': true },
                },
            },
        }),
    ],
};
