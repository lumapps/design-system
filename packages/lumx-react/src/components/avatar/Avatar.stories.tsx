import React from 'react';

import '@lumx/core/lumx-theme-lumapps.scss';
import '@lumx/core/lumx-theme-material.scss';

import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Avatar, Emphasis, IconButton, Size } from '@lumx/react';

export default { title: 'Avatar' };

export const xs = () => <Avatar image="http://i.pravatar.cc/40" size={Size.xs} />;
export const s = () => <Avatar image="http://i.pravatar.cc/48" size={Size.s} />;
export const m = () => <Avatar image="http://i.pravatar.cc/72" size={Size.m} />;
export const l = () => <Avatar image="http://i.pravatar.cc/128" size={Size.l} />;

export const avatarWithActions = () => {
    return (
        <Avatar
            image="http://i.pravatar.cc/256"
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
                        <IconButton
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground={true}
                            icon={mdiEye}
                            size={Size.s}
                        />
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
};
