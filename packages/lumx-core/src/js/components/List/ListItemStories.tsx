/* eslint-disable react/no-children-prop */
import { mdiAlert } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { Size } from '../../constants';
import { DEFAULT_PROPS, type ListItemSize } from './ListItem';

const sizes: ListItemSize[] = [Size.tiny, Size.regular, Size.big];

/**
 * Setup ListItem stories for a specific framework (React or Vue).
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component,
    render: ListItem = component,
    components: { List, ListItemAction, Button, IconButton, Text, FlexBox, Thumbnail },
    decorators: { withWrapper, withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withWrapper' | 'withCombinations';
    components: {
        List: any;
        ListItemAction: any;
        Button: any;
        IconButton: any;
        Text: any;
        FlexBox: any;
        Thumbnail: any;
    };
}>) {
    const meta = {
        component,
        args: DEFAULT_PROPS,
        argTypes: {
            size: getSelectArgType(sizes),
        },
    };

    /** Default list item with text */
    const Default = {
        args: { children: 'List item' },
        decorators: [withWrapper({}, List)],
    };

    /** Combination of all states (size, clickable and non-clickable states) */
    const AllStates = {
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
                        'As button': { onClick: () => {} },
                        'As link': { linkProps: { href: '#' } },
                    },
                },
                // Only keep size variants for non-clickable list items
                excludeCombination: (props: any) => {
                    const isClickable = props.onClick || props.linkProps?.href;
                    const propKeys = Object.keys(props);
                    const isDefaultVariant =
                        propKeys.length === 2 && propKeys.includes('size') && propKeys.includes('children');
                    return !isClickable && !isDefaultVariant;
                },
            }),
        ],
    };

    /**
     * Action area with a default action and a secondary actions in before or after slots.
     */
    const ActionArea = {
        argTypes: {
            onClick: { action: true },
        },
        render({ onClick, size }: any) {
            const beforeContent = (
                <Thumbnail
                    image="https://i.pravatar.cc/128?img=32"
                    variant="rounded"
                    alt="Profile"
                    size="m"
                    onClick={onClick}
                />
            );
            const afterContent = (
                <FlexBox orientation="horizontal" gap="regular">
                    <IconButton size="s" emphasis="medium" icon={mdiAlert} label="Alert" onClick={onClick} />
                    <Button size="s" emphasis="medium" onClick={onClick}>
                        Secondary action
                    </Button>
                </FlexBox>
            );
            return (
                <List itemPadding="big">
                    <ListItem
                        size={size}
                        before={beforeContent}
                        after={afterContent}
                        style={{ outline: '1px dashed red' }}
                        children={
                            <>
                                <ListItemAction onClick={onClick}>Main action as button</ListItemAction>
                                <Text as="p" color="dark-L2">
                                    Some text outside the main action
                                </Text>
                            </>
                        }
                    />
                    <ListItem
                        size={size}
                        before={beforeContent}
                        after={afterContent}
                        style={{ outline: '1px dashed red' }}
                        children={
                            <>
                                <ListItemAction as="a" onClick={onClick}>
                                    Main action as link
                                </ListItemAction>
                                <Text as="p" color="dark-L2">
                                    Some text outside the main action
                                </Text>
                            </>
                        }
                    />
                </List>
            );
        },
    };

    return { meta, Default, AllStates, ActionArea };
}
