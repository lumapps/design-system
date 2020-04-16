import React from 'react';

import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export default { title: 'LumX components/Side Navigation' };

export const sideNavigation = () => (
    <SideNavigation>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com' }}
        />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com/not-visited' }}
        />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com/not-visited-1' }}
        />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
    </SideNavigation>
);
