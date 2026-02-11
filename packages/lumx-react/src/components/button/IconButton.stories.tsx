import { IconButton } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/components/Button/IconButtonStories';

const { meta, ...stories } = setup({
    component: IconButton,
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/IconButton',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithImage = { ...stories.WithImage };
export const IconStateVariations = { ...stories.IconStateVariations };
