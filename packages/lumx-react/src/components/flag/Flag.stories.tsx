import { Flag } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/Flag/Stories';

const { meta, Default, WithIcon, AllColors, Truncate } = setup({
    component: Flag,
    decorators: { withWrapper, withCombinations, withResizableBox },
});

export default {
    title: 'LumX components/flag/Flag',
    ...meta,
};

export { Default, WithIcon, AllColors, Truncate };
