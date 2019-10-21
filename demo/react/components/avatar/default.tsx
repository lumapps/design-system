import React, { CSSProperties, ReactElement } from 'react';

import { Avatar, ButtonEmphasis, IconButton, Size, Theme } from 'LumX';
import { mdiDelete, mdiEye, mdiPencil } from 'LumX/icons';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Avatar>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <div style={demoContainerStyle}>
            <Avatar theme={theme} image="http://i.pravatar.cc/40" size={Size.xs} />
            <Avatar theme={theme} image="http://i.pravatar.cc/48" size={Size.s} />
            <Avatar theme={theme} image="http://i.pravatar.cc/72" size={Size.m} />
            <Avatar theme={theme} image="http://i.pravatar.cc/128" size={Size.l} />
            <Avatar theme={theme} image="http://i.pravatar.cc/256" size={Size.xl} />
            <Avatar
                theme={theme}
                image="http://i.pravatar.cc/256"
                size={Size.xl}
                actions={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="lumx-spacing-margin-right-regular">
                            <IconButton
                                color="dark"
                                emphasis={ButtonEmphasis.low}
                                hasBackground={true}
                                icon={mdiPencil}
                                size={Size.s}
                            />
                        </div>

                        <div className="lumx-spacing-margin-right-regular">
                            <IconButton
                                color="dark"
                                emphasis={ButtonEmphasis.low}
                                hasBackground={true}
                                icon={mdiEye}
                                size={Size.s}
                            />
                        </div>

                        <div>
                            <IconButton
                                color="dark"
                                emphasis={ButtonEmphasis.low}
                                hasBackground={true}
                                icon={mdiDelete}
                                size={Size.s}
                            />
                        </div>
                    </div>
                }
                hasActions={true}
            />
        </div>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
