import { List, ListItem, ListSubheader, Size } from '@lumx/react';

export const App = () => (
    <div>
        <List>
            <ListSubheader>Default</ListSubheader>

            <ListItem size={Size.big} className="lumx-color-background-dark-L6">
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-color-font-dark-L2">Secondary text</span>
                </div>
            </ListItem>
        </List>
        <List itemPadding={Size.big}>
            <ListSubheader>Big padding</ListSubheader>

            <ListItem size={Size.big} className="lumx-color-background-dark-L6">
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-color-font-dark-L2">Secondary text</span>
                </div>
            </ListItem>
        </List>
        <List itemPadding={Size.huge}>
            <ListSubheader>Huge padding</ListSubheader>

            <ListItem size={Size.big} className="lumx-color-background-dark-L6">
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
