import { RadioButton } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/RadioButton/Stories';

const { meta, Default, LabelAndHelper, Disabled } = setup({
    component: RadioButton,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/radio-button/Radio button',
    decorators: [
        withValueOnChange({
            valueProp: 'isChecked',
            valueTransform: (value) => value === 'radio-html-value',
        }),
    ],
    ...meta,
};

export { Default, LabelAndHelper, Disabled };
