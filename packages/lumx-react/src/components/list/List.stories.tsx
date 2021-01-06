import React, { useRef } from 'react';

import { mdiAccount, mdiOpenInNew } from '@lumx/icons';
import { Icon, ListDivider, ListSubheader, Size } from '@lumx/react';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';

import { List } from './List';
import { ListItem } from './ListItem';

export default { title: 'LumX components/list/List' };

export const KeyboardNavigation = () => {
    const listRef = useRef<any>();
    const firstItemRef = useRef<any>();

    const focusList = () => {
        return listRef.current?.focus();
    };

    const focusFirsItem = () => {
        return firstItemRef.current?.focus();
    };

    const CustomListItem = () => {
        return <ListItem onItemSelected={action('onItemSelected custom list item')}>Custom list item</ListItem>;
    };

    return (
        <>
            <button type="button" onClick={focusList}>
                focus list
            </button>
            <button type="button" onClick={focusFirsItem}>
                focus first item
            </button>
            <List onListItemSelected={action('List onListItemSelected')} ref={listRef}>
                <ListItem linkRef={firstItemRef} onItemSelected={action('onItemSelected: Clickable item 1')}>
                    Clickable item 1
                </ListItem>
                <ListDivider />
                <ListItem linkProps={{ href: '#' }}>Link item 1</ListItem>
                <>
                    <ListItem>Non clickable (=non navigable) item</ListItem>
                    <ListSubheader>Header</ListSubheader>
                    <ListItem linkProps={{ href: '#' }}>Link item 2</ListItem>
                    <ListSubheader>Header</ListSubheader>
                </>
                <CustomListItem />
                {[
                    <ListItem key="1" linkProps={{ href: '#' }}>
                        Link item 3
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

export const WithItemPadding = () => {
    const listItemSize = select('list item size', [Size.tiny, Size.regular, Size.big, Size.huge], Size.big);
    const listItem = (
        <ListItem
            className="lumx-color-background-dark-L6"
            size={listItemSize}
            linkProps={{ href: text('link href', '#') }}
        >
            <div>Two-line item</div>
            <div className="lumx-color-font-dark-L2">Secondary text</div>
        </ListItem>
    );
    return (
        <>
            Default item padding:
            <List>
                {listItem}
                {listItem}
            </List>
            Big item padding:
            <List itemPadding={Size.big}>
                {listItem}
                {listItem}
            </List>
            Huge item padding:
            <List itemPadding={Size.huge}>
                {listItem}
                {listItem}
            </List>
        </>
    );
};

export const AsLink = () => {
    return (
        <div className="demo-grid">
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
                    linkProps={{ href: 'http://www.google.com', target: '_blank' }}
                >
                    <span>Google</span>
                </ListItem>
            </List>
        </div>
    );
};

export const WithCustomChildren = () => {
    const CustomListItem = () => {
        return <ListItem onItemSelected={action('onItemSelected custom list item')}>Custom list item</ListItem>;
    };

    return (
        <div className="demo-grid">
            <List>
                <CustomListItem />
                <CustomListItem />
                <CustomListItem />
            </List>
        </div>
    );
};
