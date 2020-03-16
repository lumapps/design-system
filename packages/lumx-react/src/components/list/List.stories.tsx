import { List, ListItem, Size } from '@lumx/react';
import React from 'react';

export default { title: 'LumX components/List' };

export const withItemPadding = () => {
    return (
        <div className="demo-grid">
            <List>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List itemPadding={Size.big}>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List itemPadding={Size.huge}>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
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
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List isClickable itemPadding={Size.big}>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
            <List isClickable itemPadding={Size.huge}>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
                <ListItem className="lumx-theme-background-dark-L6" size={Size.big}>
                    <div>
                        <span>Two-line item</span>
                    </div>

                    <div>
                        <span className="lumx-theme-color-dark-L2">Secondary text</span>
                    </div>
                </ListItem>
            </List>
        </div>
    );
};
