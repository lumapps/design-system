import React, { Ref } from 'react';
import { FlexBox, IconButton } from '@lumx/react';
import { mdiMenu } from '@lumx/icons';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';

import './ResponsiveTopBar.scss';

interface ResponsiveTopBarProps {
    onOpen(): void;
    openNavButtonRef: Ref<HTMLElement>;
}

export const ResponsiveTopBar: React.FC<ResponsiveTopBarProps> = ({ onOpen, openNavButtonRef }) => (
    <FlexBox className="responsive-top-bar" orientation="horizontal" hAlign="center" gap="regular">
        <IconButton
            ref={openNavButtonRef as any}
            onClick={onOpen}
            label="Open the navigation menu"
            icon={mdiMenu}
            emphasis="low"
        />
        <HomeLogoLink />
    </FlexBox>
);
