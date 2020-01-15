import React from 'react';

import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Avatar, Emphasis, IconButton, Size } from '@lumx/react';

import { text } from '@storybook/addon-knobs';

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
