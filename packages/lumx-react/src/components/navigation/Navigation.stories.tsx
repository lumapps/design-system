/* eslint-disable no-script-url */
import React from 'react';

import {
    mdiHome,
    mdiMessageTextOutline,
    mdiFolderGoogleDrive,
    mdiTextBox,
    mdiLink,
    mdiGoogleCirclesExtended,
    mdiFolder,
} from '@lumx/icons';
import { Navigation } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { text } from '@storybook/addon-knobs';

export default { title: 'LumX components/navigation/Navigation' };

export const VerticalWithSection = ({ theme }: any) => (
    <Navigation theme={theme} aria-label="navigation">
        <Navigation.Button isSelected label="Homepage" icon={mdiHome} />
        <Navigation.Link label="Custom link element" icon={mdiMessageTextOutline} linkAs={CustomLink} />
        <Navigation.Button label="Button element" icon={mdiFolderGoogleDrive} />
        <Navigation.Section label="Section 1" icon={mdiFolder}>
            <Navigation.Button label="A content" icon={mdiTextBox} />
            <Navigation.Link label="A link" icon={mdiLink} linkProps={{ href: 'https://www.google.com' }} />
            <Navigation.Button label="A community" icon={mdiGoogleCirclesExtended} />
        </Navigation.Section>
    </Navigation>
);
