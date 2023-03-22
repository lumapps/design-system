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
import { Navigation, Orientation } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

export default { title: 'LumX components/navigation/Navigation' };

export const Default = ({ theme, onClick, orientation }: any) => {
    return (
        <Navigation theme={theme} aria-label="navigation" orientation={orientation}>
            <Navigation.Item isCurrentPage label="Homepage" icon={mdiHome} href="#" />
            <Navigation.Item
                label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                href="#"
            />
            <Navigation.Item
                label="Custom link element"
                icon={mdiMessageTextOutline}
                as={CustomLink}
                // `to` prop is required in CustomLink
                to="#"
            />
            <Navigation.Item as="button" label="Button element" icon={mdiFolderGoogleDrive} onClick={onClick} />
            <Navigation.Section label="Section 1" icon={mdiFolder}>
                <Navigation.Item label="A content" href="#content" />
                <Navigation.Item label="A button" icon={mdiLink} href="https://www.google.com" />
                <Navigation.Item
                    label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                    icon={mdiTextBox}
                    href="#content"
                />
                <Navigation.Item label="A community" icon={mdiGoogleCirclesExtended} href="#community" />
                <Navigation.Section label="Section 1.1" icon={mdiFolder}>
                    <Navigation.Item label="A content" icon={mdiTextBox} href="#content" />
                    <Navigation.Item
                        label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                        icon={mdiTextBox}
                        href="#content"
                    />
                    <Navigation.Item label="A link" icon={mdiLink} href="https://www.google.com" />
                    <Navigation.Item label="A community" icon={mdiGoogleCirclesExtended} href="#community" />
                </Navigation.Section>
            </Navigation.Section>
            <Navigation.Section label="Section 2" icon={mdiFolder}>
                <Navigation.Item label="A content" icon={mdiTextBox} href="#content" />
                <Navigation.Item label="A link" icon={mdiLink} href="https://www.google.com" />
                <Navigation.Item label="A community" icon={mdiGoogleCirclesExtended} href="#community" />
            </Navigation.Section>
        </Navigation>
    );
};
Default.argTypes = { onClick: { action: true } };

export const VerticalWithSection: any = Default.bind({});
VerticalWithSection.args = { orientation: Orientation.vertical };

export const HorizontalWithSection: any = Default.bind({});
HorizontalWithSection.args = { orientation: Orientation.horizontal };
