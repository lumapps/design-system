import { List, ListItemSize, Size } from '@lumx/react';

import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { isEqual } from '@lumx/react/utils/object/isEqual';
import { ListItem } from './ListItem';

const sizes: ListItemSize[] = [Size.tiny, Size.regular, Size.big];

export default {
    title: 'LumX components/list/ListItem',
    component: ListItem,
    args: ListItem.defaultProps,
    argTypes: {
        size: getSelectArgType(sizes),
    },
};

/**
 * Default list item with text
 */
export const Default = {
    args: { children: 'List item' },
    decorators: [withWrapper({}, List)],
};

/**
 * Inject a custom link component
 */
export const CustomLink_ = {
    args: {
        linkAs: CustomLink,
        children: 'List item custom link',
    },
    decorators: [withWrapper({}, List)],
};

/**
 * Combination of all states (size, clickable and non-clickable states)
 */
export const AllStates = {
    args: { children: 'List item' },
    decorators: [
        withWrapper({}, List),
        withCombinations({
            combinations: {
                rows: { key: 'size', options: sizes },
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    'ARIA Disabled': { 'aria-disabled': true },
                    Selected: { isSelected: true },
                    Highlighted: { isHighlighted: true },
                },
                sections: {
                    Default: {},
                    'As button': { onItemSelected: () => {} },
                    'As link': { linkProps: { href: '#' } },
                },
            },
            // Only keep size variants for non clickable list items
            excludeCombination: (props) =>
                !props.onItemSelected && !props.linkProps?.href && !isEqual(Object.keys(props), ['size', 'children']),
        }),
    ],
};
