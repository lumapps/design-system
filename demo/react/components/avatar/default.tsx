import React, { CSSProperties, Fragment } from 'react';

import { Avatar, AvatarSize, AvatarTheme } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: AvatarTheme;
}

/////////////////////////////

/**
 * The demo for the default <Avatar>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <div style={demoContainerStyle}>
            <Avatar theme={theme} image="http://i.pravatar.cc/40" size={AvatarSize.xs} />
            <Avatar theme={theme} image="http://i.pravatar.cc/48" size={AvatarSize.s} />
            <Avatar theme={theme} image="http://i.pravatar.cc/72" size={AvatarSize.m} />
            <Avatar theme={theme} image="http://i.pravatar.cc/128" size={AvatarSize.l} />
            <Avatar theme={theme} image="http://i.pravatar.cc/256" size={AvatarSize.xl} />
        </div>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
