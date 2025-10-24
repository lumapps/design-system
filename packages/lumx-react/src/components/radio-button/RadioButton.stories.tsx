import { RadioButton } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import uniqueId from 'lodash/uniqueId';

export default {
    title: 'LumX components/radio-button/Radio button',
    component: RadioButton,
    args: {
        ...RadioButton.defaultProps,
        name: 'radiobutton-html-name',
        value: 'radiobutton-html-value',
    },
    argTypes: {
        onChange: { action: true },
        name: { control: false },
        value: { control: false },
    },
    decorators: [
        withValueOnChange({
            valueProp: 'isChecked',
            valueTransform: (value) => value === 'radiobutton-html-value',
        }),
    ],
};

/**
 * Default radio button
 */
export const Default = {};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    args: {
        label: 'Radio button label',
        helper: loremIpsum('tiny'),
    },
};

/**
 * All state combinations
 */
export const AllStates = {
    args: { ...LabelAndHelper.args, helper: 'Radio button helper' },
    decorators: [
        withCombinations({
            combinations: {
                rows: {
                    Default: {},
                    Checked: { isChecked: true },
                },
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    'ARIA Disabled': { 'aria-disabled': true },
                },
            },
            combinator(a, b) {
                return Object.assign(a, b, {
                    // Injecting a unique name for each radio buttons to make sure they can be individually focused
                    name: uniqueId('name'),
                    // Disabling
                    onChange: undefined,
                });
            },
        }),
    ],
};
