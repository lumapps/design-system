import { InputHelper } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/InputHelper/Stories';

const { meta, Default, AllKinds } = setup({
    component: InputHelper,
    decorators: { withWrapper, withCombinations },
});

export default {
    title: 'LumX components/input-helper/Input Helper',
    ...meta,
};

export { Default, AllKinds };
