import { Switch } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Switch/Stories';

const { meta, Default, LabelAndHelper, PositionRight, Disabled } = setup({
    component: Switch,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/switch/Switch',
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
    ...meta,
};

export { Default, LabelAndHelper, PositionRight, Disabled };
