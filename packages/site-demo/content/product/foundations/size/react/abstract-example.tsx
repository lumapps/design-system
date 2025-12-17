import { Avatar, Button, Emphasis, LinkPreview, List, ListItem, Size } from '@lumx/react';

export const App = () => (
    <>
        <List className="lumx-spacing-margin-right-huge">
            <ListItem
                size={Size.big}
                before={<Avatar alt="User" image="../../components/avatar/assets/persona.png" size={Size.m} />}
                after={<Button emphasis={Emphasis.low}>Button</Button>}
            >
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-color-font-dark-L2">Secondary text</span>
                </div>
            </ListItem>
        </List>
        <div style={{ width: 350 }}>
            <LinkPreview
                title="Link title"
                description="Description"
                link="https://google.com"
                size={Size.big}
                thumbnail="https://picsum.photos/320/240"
            />
        </div>
    </>
);
