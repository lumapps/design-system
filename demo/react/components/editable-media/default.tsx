import React, { ReactElement } from 'react';

import { EditableMedia, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <EditableMedia>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <EditableMedia theme={theme}>Default EditableMedia</EditableMedia>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
