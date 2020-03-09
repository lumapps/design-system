import React from 'react';

import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, Emphasis, Icon, IconButton, Size } from '@lumx/react';
import { Avatar } from './Avatar';

import { select, text } from '@storybook/addon-knobs';

export default { title: 'Avatar' };

/**
 * Avatar stories showing a simple Avatar with different sizes.
 * @return component with different sizes.
 */
export const xs = () => <Avatar image={text('Image', 'http://i.pravatar.cc/40')} size={Size.xs} />;

export const s = () => <Avatar image={text('Image', 'http://i.pravatar.cc/48')} size={Size.s} />;

export const m = () => <Avatar image={text('Image', 'http://i.pravatar.cc/72')} size={Size.m} />;

export const l = () => <Avatar image={text('Image', 'http://i.pravatar.cc/128')} size={Size.l} />;

/**
 * Avatar story showing a simple avatar with different actions.
 * @return component with different actions.
 */
export const avatarWithActions = () => (
    <Avatar
        image={text('Image', 'http://i.pravatar.cc/256')}
        size={Size.xl}
        actions={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="lumx-spacing-margin-right-regular">
                    <IconButton
                        color="dark"
                        emphasis={Emphasis.low}
                        hasBackground={true}
                        icon={mdiPencil}
                        size={Size.s}
                    />
                </div>

                <div className="lumx-spacing-margin-right-regular">
                    <IconButton color="dark" emphasis={Emphasis.low} hasBackground={true} icon={mdiEye} size={Size.s} />
                </div>

                <div>
                    <IconButton
                        color="dark"
                        emphasis={Emphasis.low}
                        hasBackground={true}
                        icon={mdiDelete}
                        size={Size.s}
                    />
                </div>
            </div>
        }
    />
);

export const avatarWithBadge = () => (
    <>
        <Avatar
            className="lumx-spacing-margin-bottom-regular"
            image={text('Image', 'http://i.pravatar.cc/40')}
            size={Size.xs}
            badge={
                <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />
        <Avatar
            className="lumx-spacing-margin-bottom-regular"
            image={text('Image', 'http://i.pravatar.cc/48')}
            size={Size.s}
            badge={
                <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />
        <Avatar
            className="lumx-spacing-margin-bottom-regular"
            image={text('Image', 'http://i.pravatar.cc/72')}
            size={Size.m}
            badge={
                <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />
        <Avatar
            className="lumx-spacing-margin-bottom-regular"
            image={text('Image', 'http://i.pravatar.cc/128')}
            size={Size.l}
            badge={
                <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />
    </>
);
