import { Checkbox } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Checkbox/Stories';

const { meta, Default, LabelAndHelper, IntermediateState, Disabled } = setup({
    component: Checkbox,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/checkbox/Checkbox',
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
    ...meta,
};

export { Default, LabelAndHelper, IntermediateState, Disabled };
