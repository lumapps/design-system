import { Chip, Icon } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { withTheming } from '@lumx/vue/stories/decorators/withTheming';
import { setup } from '@lumx/core/js/components/Chip/Stories';
import { mdiClose, mdiViewList } from '@lumx/icons';

const { meta, ...stories } = setup({
    component: Chip,
    components: { Icon },
    render: ({ children, ...args }: any) => <Chip {...args}>{children}</Chip>,
    decorators: { withCombinations, withThemedBackground, withTheming },
});

// Override render for stories that use before/after to use slots instead of props
const renderWithSlots = ({ children, ...args }: any) => (
    <Chip {...args}>
        {{
            before: () => <Icon icon={mdiViewList} />,
            default: () => children,
            after: () => <Icon icon={mdiClose} />,
        }}
    </Chip>
);

export default {
    title: 'LumX components/chip/Chip',
    ...meta,
};

export const Default = { ...stories.Default };
export const ChipButton = { ...stories.ChipButton };
export const ChipLink = { ...stories.ChipLink };
export const WithAfterAndBefore = { ...stories.WithAfterAndBefore, render: renderWithSlots };
export const ColorVariants = { ...stories.ColorVariants, render: renderWithSlots };
export const SelectedVariants = { ...stories.SelectedVariants, render: renderWithSlots };
export const Disabled = { ...stories.Disabled };
export const Theming = { ...stories.Theming, render: renderWithSlots };
