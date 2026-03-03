import { Chip, Icon } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withTheming } from '@lumx/react/stories/decorators/withTheming';
import { setup } from '@lumx/core/js/components/Chip/Stories';

const { meta, ...stories } = setup({
    component: Chip,
    components: { Icon },
    decorators: { withCombinations, withThemedBackground, withTheming },
});

export default {
    title: 'LumX components/chip/Chip',
    ...meta,
};

export const Default = { ...stories.Default };
export const ChipButton = { ...stories.ChipButton };
export const ChipLink = { ...stories.ChipLink };
export const WithAfterAndBefore = { ...stories.WithAfterAndBefore };
export const ColorVariants = { ...stories.ColorVariants };
export const SelectedVariants = { ...stories.SelectedVariants };
export const Disabled = { ...stories.Disabled };
export const Theming = { ...stories.Theming };
