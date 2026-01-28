import React, { Ref } from 'react';
import { Match } from '@gatsbyjs/reach-router';

import { mdiMenu } from '@lumx/icons';
import { IconButton } from '@lumx/react';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';
import { SearchButton } from '@lumx/demo/components/search/SearchButton';

import { LumxVersion } from './LumxVersion';
import { FrameworkSelector } from './FrameworkSelector';

import './MainHeader.scss';

interface MainHeaderProps {
    openMenu(): void;
    openNavButtonRef: Ref<HTMLElement>;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ openMenu, openNavButtonRef }) => (
    <div className="main-header">
        <IconButton
            className="main-header__responsive-nav-button"
            ref={openNavButtonRef as any}
            onClick={openMenu}
            label="Open the navigation menu"
            icon={mdiMenu}
            emphasis="low"
        />
        <HomeLogoLink className="main-header__home-logo-link" />
        <Match path="/product/*">
            {({ match }) =>
                match && (
                    <div className="main-header__extras">
                        <FrameworkSelector />
                        <LumxVersion />
                    </div>
                )
            }
        </Match>
        <SearchButton className="main-header__search-button" />
    </div>
);
