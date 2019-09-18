import React, { ReactElement } from 'react';

import { Emphasis, SideNavigation, SideNavigationItem, Theme } from 'LumX';
import { mdiAlert } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Slideshow>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <SideNavigation theme={theme}>
            <SideNavigationItem label="Level 0 (open)" isOpen>
                <SideNavigationItem label="Level 1 (closed)" emphasis={Emphasis.medium}>
                    <SideNavigationItem label="Level 2" />
                </SideNavigationItem>
                <SideNavigationItem label="Level 1 (open)" emphasis={Emphasis.medium} isOpen>
                    <SideNavigationItem label="Level 2 (with icon)" emphasis={Emphasis.low} icon={mdiAlert} />
                    <SideNavigationItem label="Level 2 (with icon & selected)" emphasis={Emphasis.low} isSelected />
                </SideNavigationItem>
            </SideNavigationItem>
            <SideNavigationItem label="Level 0 (no child)" />
        </SideNavigation>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
