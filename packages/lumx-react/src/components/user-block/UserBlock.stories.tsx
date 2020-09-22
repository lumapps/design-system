import { mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Icon, List, ListItem, Size } from '@lumx/react';
import React from 'react';
import { UserBlock } from './UserBlock';

export default { title: 'LumX components/user-block/UserBlock' };

export const s = () => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/40"
                size={Size.s}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export const m = () => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/72"
                size={Size.m}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export const l = () => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/128"
                size={Size.l}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export const withBadge = () => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/72"
                avatarProps={{
                    badge: (
                        <Badge color={ColorPalette.blue}>
                            <Icon icon={mdiStar} />
                        </Badge>
                    ),
                }}
                size={Size.m}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export const list = () => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <List itemPadding={Size.big}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <UserBlock
                        name="Emmitt O. Lum"
                        fields={['Creative developer', 'Denpasar']}
                        avatar="http://i.pravatar.cc/72"
                        avatarProps={{
                            badge: (
                                <Badge color={ColorPalette.blue}>
                                    <Icon icon={mdiStar} />
                                </Badge>
                            ),
                        }}
                        size={Size.m}
                        onMouseEnter={logAction('Mouse entered')}
                        onMouseLeave={logAction('Mouse left')}
                        onClick={logAction('UserBlock clicked')}
                    />
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <UserBlock
                        name="Emmitt O. Lum"
                        fields={['Creative developer', 'Denpasar']}
                        avatar="http://i.pravatar.cc/72"
                        avatarProps={{
                            badge: (
                                <Badge color={ColorPalette.blue}>
                                    <Icon icon={mdiStar} />
                                </Badge>
                            ),
                        }}
                        size={Size.m}
                        onMouseEnter={logAction('Mouse entered')}
                        onMouseLeave={logAction('Mouse left')}
                        onClick={logAction('UserBlock clicked')}
                    />
                </ListItem>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <UserBlock
                        name="Emmitt O. Lum"
                        fields={['Creative developer', 'Denpasar']}
                        avatar="http://i.pravatar.cc/72"
                        avatarProps={{
                            badge: (
                                <Badge color={ColorPalette.blue}>
                                    <Icon icon={mdiStar} />
                                </Badge>
                            ),
                        }}
                        size={Size.m}
                        onMouseEnter={logAction('Mouse entered')}
                        onMouseLeave={logAction('Mouse left')}
                        onClick={logAction('UserBlock clicked')}
                    />
                </ListItem>
            </List>
        </div>
    );
};
