import { Button, FlexBox, IconButton, List, ListItemSize, Size, Text, Thumbnail } from '@lumx/react';
import { mdiAlert } from '@lumx/icons';

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
 * Action area with a default action and a secondary actions in before or after slots.
 */
export const ActionArea = {
    argTypes: {
        onClick: { action: true },
    },
    render({ onClick, size }: any) {
        return (
            <List itemPadding="big">
                <ListItem
                    size={size}
                    before={
                        <Thumbnail
                            image="https://i.pravatar.cc/128?img=32"
                            variant="rounded"
                            alt="Profile"
                            size="m"
                            onClick={onClick}
                        />
                    }
                    after={
                        <FlexBox orientation="horizontal" gap="regular">
                            <IconButton size="s" emphasis="medium" icon={mdiAlert} label="Alert" onClick={onClick} />
                            <Button size="s" emphasis="medium" onClick={onClick}>
                                Secondary action
                            </Button>
                        </FlexBox>
                    }
                    style={{ outline: '1px dashed red' }}
                >
                    <ListItem.Action onClick={onClick}>Main action as button</ListItem.Action>
                    <Text as="p" color="dark-L2">
                        Some text outside the main action
                    </Text>
                </ListItem>
                <ListItem
                    size={size}
                    before={
                        <Thumbnail
                            image="https://i.pravatar.cc/128?img=32"
                            variant="rounded"
                            alt="Profile"
                            size="m"
                            onClick={onClick}
                        />
                    }
                    after={
                        <FlexBox orientation="horizontal" gap="regular">
                            <IconButton size="s" emphasis="medium" icon={mdiAlert} label="Alert" onClick={onClick} />
                            <Button size="s" emphasis="medium" onClick={onClick}>
                                Secondary action
                            </Button>
                        </FlexBox>
                    }
                    style={{ outline: '1px dashed red' }}
                >
                    <ListItem.Action as="a" onClick={onClick}>
                        Main action as link
                    </ListItem.Action>
                    <Text as="p" color="dark-L2">
                        Some text outside the main action
                    </Text>
                </ListItem>
            </List>
        );
    },
};
