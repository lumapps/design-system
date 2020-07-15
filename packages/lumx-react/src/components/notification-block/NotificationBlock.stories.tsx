import { mdiClose, mdiHeart, mdiMessageTextOutline } from '@lumx/icons';
import { Avatar, Badge, ColorPalette, Emphasis, Icon, IconButton, Size } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';
import { NotificationBlock } from './NotificationBlock';

export default { title: 'LumX components/NotificationBlock' };

export const icon = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <NotificationBlock
                after={<IconButton icon={mdiClose} emphasis={Emphasis.low} theme={theme} />}
                before={<Icon icon={mdiMessageTextOutline} hasShape theme={theme} />}
                title="Title"
                description="Description message"
                date="2min ago"
                theme={theme}
            />
        </div>
    );
};

export const avatar = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <NotificationBlock
                after={<IconButton icon={mdiClose} emphasis={Emphasis.low} theme={theme} />}
                before={
                    <Avatar
                        image={text('Image', 'http://i.pravatar.cc/40')}
                        size={Size.m}
                        badge={
                            <Badge color={select('Colors', ColorPalette, ColorPalette.red)}>
                                <Icon icon={mdiHeart} />
                            </Badge>
                        }
                    />
                }
                title="Title"
                description="Description message"
                date="2min ago"
                theme={theme}
            />
        </div>
    );
};

export const titleless = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <NotificationBlock
                after={<IconButton icon={mdiClose} emphasis={Emphasis.low} theme={theme} />}
                before={
                    <Avatar
                        image={text('Image', 'http://i.pravatar.cc/40')}
                        size={Size.m}
                        badge={
                            <Badge color={select('Colors', ColorPalette, ColorPalette.red)}>
                                <Icon icon={mdiHeart} />
                            </Badge>
                        }
                    />
                }
                description="Description message"
                date="2min ago"
                theme={theme}
            />
        </div>
    );
};

export const HTMLDescription = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <NotificationBlock
                after={<IconButton icon={mdiClose} emphasis={Emphasis.low} theme={theme} />}
                before={
                    <Avatar
                        image={text('Image', 'http://i.pravatar.cc/40')}
                        size={Size.m}
                        badge={
                            <Badge color={select('Colors', ColorPalette, ColorPalette.red)}>
                                <Icon icon={mdiHeart} />
                            </Badge>
                        }
                    />
                }
                description={<div dangerouslySetInnerHTML={{ __html: '<strong>Description</strong> message' }} />}
                date="2min ago"
                theme={theme}
            />
        </div>
    );
};
