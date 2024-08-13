import { Checkbox } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';

export default {
    title: 'LumX components/checkbox/Checkbox',
    component: Checkbox,
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
    args: {
        isChecked: false,
        name: 'checkbox-html-name',
        value: 'checkbox-html-value',
    },
    argTypes: {
        onChange: { action: true },
        name: { control: false },
        value: { control: false },
    },
};

/**
 * Default checkbox
 */
export const Default = {};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    args: {
        label: 'Checkbox label',
        helper: loremIpsum('tiny'),
    },
};

/**
 * With intermediate state
 */
export const IntermediateState = {
    args: {
        isChecked: 'intermediate',
    },
};

/**
 * Disabled
 */
export const Disabled = {
    args: {
        ...LabelAndHelper.args,
        isDisabled: true,
    },
};
