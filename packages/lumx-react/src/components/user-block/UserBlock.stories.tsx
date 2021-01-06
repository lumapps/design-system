import { mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Icon, List, ListItem, Size } from '@lumx/react';
import { AVATAR_IMAGES, avatarImageKnob } from '@lumx/react/stories/knobs';
import React from 'react';
import { UserBlock } from './UserBlock';

export default { title: 'LumX components/user-block/UserBlock' };

export const Sizes = () => {
    const logAction = (action: string) => () => console.log(action);
    return [Size.s, Size.m, Size.l].map((size: any) => (
        <div className="demo-grid" key={size}>
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatarProps={{ image: avatarImageKnob(), alt: 'Avatar' }}
                size={size}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    ));
};

export const WithBadge = () => {
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatarProps={{
                    image: avatarImageKnob(),
                    alt: 'Avatar',
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

export const InList = () => {
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <List itemPadding={Size.big}>
                <ListItem className="lumx-color-background-dark-L6" size={Size.big}>
                    <UserBlock
                        name="Emmitt O. Lum"
                        fields={['Creative developer', 'Denpasar']}
                        avatarProps={{
                            image: avatarImageKnob('Avatar 1', AVATAR_IMAGES.avatar1),
                            alt: 'Avatar',
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
                        avatarProps={{
                            image: avatarImageKnob('Avatar 2', AVATAR_IMAGES.avatar2),
                            alt: 'Avatar',
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
                        avatarProps={{
                            image: avatarImageKnob('Avatar 3', AVATAR_IMAGES.avatar3),
                            alt: 'Avatar',
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
