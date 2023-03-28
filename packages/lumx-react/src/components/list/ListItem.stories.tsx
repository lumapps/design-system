import { List, ListItemSize, Size } from '@lumx/react';

import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { ListItem } from './ListItem';

const sizes: ListItemSize[] = [Size.tiny, Size.regular, Size.big];

export default {
    title: 'LumX components/list/ListItem',
    component: ListItem,
    args: ListItem.defaultProps,
    argTypes: {
        size: getSelectArgType(sizes),
    },
    decorators: [withWrapper({}, List)],
};

/**
 * Default list item with text
 */
export const NonClickable = {
    args: { children: 'List item' },
};

/**
 * Button list item (onClick)
 */
export const Button = {
    args: {
        children: 'List item button',
    },
    argTypes: {
        onItemSelected: { action: true },
    },
};

/**
 * Disabled button
 */
export const ButtonDisabled = {
    ...Button,
    args: {
        ...Button.args,
        isDisabled: true,
    },
};

/**
 * Link list item (href)
 */
export const Link = {
    args: {
        linkProps: { href: '#' },
        children: 'List item link',
    },
};

/**
 * Disabled link
 */
export const LinkDisabled = {
    args: {
        ...Link.args,
        isDisabled: true,
    },
};

/**
 * Inject a custom link component
 */
export const CustomLink_ = {
    args: {
        linkAs: CustomLink,
        children: 'List item custom link',
    },
};

/**
 * Combination of size and states
 */
export const SizeAndStates = {
    ...Button,
    decorators: [
        withWrapper({}, List),
        withCombinations({
            combinations: {
                rows: { key: 'size', options: sizes },
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    Selected: { isSelected: true },
                    Highlighted: { isHighlighted: true },
                },
            },
        }),
    ],
};
