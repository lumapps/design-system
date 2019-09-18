import React, { CSSProperties, ReactElement } from 'react';

import { Avatar, Size, Theme } from 'LumX';

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
        </div>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
