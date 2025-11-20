import { Chip, ChipGroup, Size } from '@lumx/react';

export default {
    title: 'LumX components/chip/ChipGroup',
    component: ChipGroup,
    args: ChipGroup.defaultProps,
    argTypes: {},
};

const chips = (
    <>
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
    </>
);

/**
 * Default chip group
 */
export const Default = {
    args: {
        children: chips,
    },
};

/**
 * Small chip group
 */
export const Small = {
    args: {
        children: chips,
        style: {
            width: '200px',
        },
    },
};
