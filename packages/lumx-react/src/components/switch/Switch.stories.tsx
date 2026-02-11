import { Switch } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Switch/Stories';

const { meta, ...stories } = setup({
    component: Switch,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/switch/Switch',
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
    ...meta,
};

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const PositionRight = { ...stories.PositionRight };
export const Disabled = { ...stories.Disabled };
