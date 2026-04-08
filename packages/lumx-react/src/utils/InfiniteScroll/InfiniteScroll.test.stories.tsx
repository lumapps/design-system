import { InfiniteScroll } from '@lumx/react/utils';
import { setup } from '@lumx/core/js/utils/InfiniteScroll/TestStories';

const { meta, ...stories } = setup({
    component: InfiniteScroll,
});

export default {
    title: 'utils/infinite-scroll/Tests',
    ...meta,
};

export const TestRendersSentinelDiv = { ...stories.TestRendersSentinelDiv };
export const TestDetectsScrollEnd = { ...stories.TestDetectsScrollEnd };
export const TestNoCallbackWithoutScroll = { ...stories.TestNoCallbackWithoutScroll };
export const TestRetriggersOnSubsequentScrolls = { ...stories.TestRetriggersOnSubsequentScrolls };
