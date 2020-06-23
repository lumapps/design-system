import React from 'react';

import { mdiAccount, mdiOpenInNew } from '@lumx/icons';
import { Icon, List, ListItem, Size } from '@lumx/react';

export default { title: 'LumX components/List' };

export const withItemPadding = () => {
    return (
        <div className="demo-grid">
            <List>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List itemPadding={Size.big}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List itemPadding={Size.huge}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
        </div>
    );
};

export const clickableWithItemPadding = () => {
    return (
        <div className="demo-grid">
            <List isClickable>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List isClickable itemPadding={Size.big}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List isClickable itemPadding={Size.huge}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-color-font-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
        </div>
    );
};

export const asLink = () => {
    return (
        <div className="demo-grid">
            <List isClickable>
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
