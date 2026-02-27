import { Button, List, ListItemSize, Size, Text } from '@lumx/react';

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

/**
 * Action area with a button as default action and a secondary action in the after slot.
 */
export const ActionAreaButton = {
    argTypes: {
        onClick: { action: true },
        onAfterClick: { action: true },
    },
    render({ onClick, onAfterClick }: any) {
        return (
            <List itemPadding="big">
                <ListItem
                    after={
                        <Button emphasis="low" onClick={onAfterClick}>
                            Secondary action
                        </Button>
                    }
                >
                    <ListItem.Action onClick={onClick}>Main action</ListItem.Action>
                    <Text as="p" color="dark-L2">
                        Some text outside the main action
                    </Text>
                </ListItem>
            </List>
        );
    },
};

/**
 * Action area with a link as default action.
 */
export const ActionAreaLink = {
    render() {
        return (
            <List itemPadding="big">
                <ListItem>
                    <ListItem.Action as="a" href="#">
                        Link action
                    </ListItem.Action>
                </ListItem>
            </List>
        );
    },
};
