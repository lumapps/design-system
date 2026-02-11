import { InputHelper } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/InputHelper/Stories';

const { meta, ...stories } = setup({
    component: InputHelper,
    decorators: { withWrapper, withCombinations },
});

export default {
    title: 'LumX components/input-helper/Input Helper',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllKinds = { ...stories.AllKinds };
