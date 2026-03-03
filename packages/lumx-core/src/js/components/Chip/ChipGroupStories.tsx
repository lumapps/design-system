import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { Size } from '../../constants';
import { DEFAULT_PROPS } from './ChipGroup';

export function setup({
    component: ChipGroup,
    components: { Chip },
}: SetupStoriesOptions<{
    components: { Chip: any };
}>) {
    const meta = {
        component: ChipGroup,
        args: DEFAULT_PROPS,
    };

    /** Default chip group */
    const Default = {
        render: () => (
            <ChipGroup>
                <Chip size={Size.s}>Apricot</Chip>
                <Chip size={Size.s}>Apple</Chip>
                <Chip size={Size.s}>Banana</Chip>
                <Chip size={Size.s}>Blueberry</Chip>
                <Chip size={Size.s}>Lemon</Chip>
                <Chip size={Size.s}>Orange</Chip>
                <Chip size={Size.s}>Peach</Chip>
                <Chip size={Size.s}>Pear</Chip>
                <Chip size={Size.s}>Pineapple</Chip>
                <Chip size={Size.s}>Melon</Chip>
                <Chip size={Size.s}>Raspberry</Chip>
                <Chip size={Size.s}>Strawberry</Chip>
                <Chip size={Size.s}>Watermelon</Chip>
            </ChipGroup>
        ),
    };

    /** Small chip group */
    const Small = {
        render: () => (
            <ChipGroup style={{ width: '200px' }}>
                <Chip size={Size.s}>Apricot</Chip>
                <Chip size={Size.s}>Apple</Chip>
                <Chip size={Size.s}>Banana</Chip>
                <Chip size={Size.s}>Blueberry</Chip>
                <Chip size={Size.s}>Lemon</Chip>
                <Chip size={Size.s}>Orange</Chip>
                <Chip size={Size.s}>Peach</Chip>
                <Chip size={Size.s}>Pear</Chip>
                <Chip size={Size.s}>Pineapple</Chip>
                <Chip size={Size.s}>Melon</Chip>
                <Chip size={Size.s}>Raspberry</Chip>
                <Chip size={Size.s}>Strawberry</Chip>
                <Chip size={Size.s}>Watermelon</Chip>
            </ChipGroup>
        ),
    };

    return { meta, Default, Small };
}
