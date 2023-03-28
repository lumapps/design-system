import { RadioButton } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';

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
