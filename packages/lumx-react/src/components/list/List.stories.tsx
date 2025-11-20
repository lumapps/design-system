import { useRef } from 'react';

import { mdiAccount, mdiOpenInNew } from '@lumx/icons';
import { Icon, ListDivider, ListProps, ListSubheader, Size } from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

import { List } from './List';
import { ListItem } from './ListItem';
import ListItemStories from './ListItem.stories';

export default {
    title: 'LumX components/list/List',
    component: List,
    args: List.defaultProps,
    argTypes: {
        itemPadding: getSelectArgType<ListProps['itemPadding']>([Size.big, Size.huge]),
        onListItemSelected: { action: true },
        'children.onItemSelected': { action: true },
        'children.size': ListItemStories.argTypes.size,
    },
};

const CustomListItem = (props: any) => <ListItem {...props}>Custom list item</ListItem>;

export const KeyboardNavigation = ({
    'children.onItemSelected': childrenOnItemSelected,
    'children.size': childrenSize,
    ...props
}: any) => {
    const listRef = useRef<any>();
    const firstItemRef = useRef<any>();

    const focusList = () => {
        return listRef.current?.focus();
    };

    const focusFirsItem = () => {
        return firstItemRef.current?.focus();
    };

    return (
        <>
            <button type="button" onClick={focusList}>
                focus list
            </button>
            <button type="button" onClick={focusFirsItem}>
                focus first item
            </button>
            <List ref={listRef} {...props}>
                <ListItem size={childrenSize} linkRef={firstItemRef} onItemSelected={childrenOnItemSelected}>
                    Clickable item 1
                </ListItem>
                <ListDivider />
                <ListItem size={childrenSize} linkProps={{ href: '#' }}>
                    Link item 1
                </ListItem>
                <>
                    <ListItem size={childrenSize}>Non clickable (=non navigable) item</ListItem>
                    <ListSubheader>Header</ListSubheader>
                    <ListItem size={childrenSize} linkProps={{ href: '#' }}>
                        Link item 2
                    </ListItem>
                    <ListSubheader>Header</ListSubheader>
                </>
                <ListItem size={childrenSize} linkProps={{ href: '#' }} isDisabled>
                    Disabled link item
                </ListItem>
                <ListItem size={childrenSize} onItemSelected={childrenOnItemSelected} isDisabled>
                    Disabled button item
                </ListItem>
                <CustomListItem size={childrenSize} onItemSelected={childrenOnItemSelected} />
                {[
                    <ListItem size={childrenSize} key="1" linkProps={{ href: '#' }}>
                        Link item 4
                    </ListItem>,
                ]}
            </List>
            <pre>{`
                When focused:
                arrow up/down to move focus on list item
                tab/shift+tab to move focus on list item AND outside the list
            `}</pre>
        </>
    );
};

export const AsLink = () => (
    <List>
        <ListItem
            before={<Icon icon={mdiAccount} />}
            className="lumx-color-background-dark-L6"
            linkProps={{ href: '#' }}
        >
            <span>My first link</span>
        </ListItem>
        <ListItem
            className="lumx-color-background-dark-L6"
            after={<Icon icon={mdiOpenInNew} />}
            linkProps={{ href: 'https://example.com', target: '_blank' }}
        >
            <span>Google</span>
        </ListItem>
    </List>
);

export const WithCustomChildren = ({
    'children.onItemSelected': childrenOnItemSelected,
    'children.size': childrenSize,
    ...props
}: any) => (
    <List {...props}>
        <CustomListItem size={childrenSize} onItemSelected={childrenOnItemSelected} />
        <CustomListItem size={childrenSize} onItemSelected={childrenOnItemSelected} />
        <CustomListItem size={childrenSize} onItemSelected={childrenOnItemSelected} />
    </List>
);
