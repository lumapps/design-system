import { Button, Tooltip } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Tooltip/TestStories';

const { meta, ...testStories } = setup({
    component: Tooltip,
    components: { Button },
});

export default {
    title: 'LumX components/tooltip/Tooltip/Tests',
    ...meta,
};

export const TestActivateOnHover = { ...testStories.TestActivateOnHover };
export const TestHoverAnchorThenTooltip = { ...testStories.TestHoverAnchorThenTooltip };
export const TestFocusVisibleAndEscape = { ...testStories.TestFocusVisibleAndEscape };
export const TestNoActivateOnClickFocus = { ...testStories.TestNoActivateOnClickFocus };
export const TestCloseModeHide = { ...testStories.TestCloseModeHide };
export const TestAriaDescribedByOnHover = { ...testStories.TestAriaDescribedByOnHover };
export const TestAriaDescribedByOnWrapperHover = { ...testStories.TestAriaDescribedByOnWrapperHover };
export const TestAriaLabelledByOnHover = { ...testStories.TestAriaLabelledByOnHover };
export const TestAriaLabelledByOnWrapperHover = { ...testStories.TestAriaLabelledByOnWrapperHover };
