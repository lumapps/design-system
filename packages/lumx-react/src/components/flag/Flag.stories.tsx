import { Flag } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/Flag/Stories';

const { meta, ...stories } = setup({
    component: Flag,
    decorators: { withWrapper, withCombinations, withResizableBox },
});

export default {
    title: 'LumX components/flag/Flag',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithIcon = { ...stories.WithIcon };
export const AllColors = { ...stories.AllColors };
export const Truncate = { ...stories.Truncate };
