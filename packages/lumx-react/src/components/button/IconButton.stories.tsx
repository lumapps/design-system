import { IconButton } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/components/Button/IconButtonStories';

const { meta, Default, WithImage, IconStateVariations } = setup({
    component: IconButton,
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/IconButton',
    ...meta,
};

export { Default, WithImage, IconStateVariations };
