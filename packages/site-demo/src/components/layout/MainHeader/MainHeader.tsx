import React, { Ref } from 'react';
import { Match } from '@reach/router';

import { mdiMenu } from '@lumx/icons';
import { IconButton } from '@lumx/react';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';
import { SearchButton } from '@lumx/demo/components/search/SearchButton';

import { LumxVersion } from './LumxVersion';
import './MainHeader.scss';

interface MainHeaderProps {
    openMenu(): void;
    openNavButtonRef: Ref<HTMLElement>;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ openMenu, openNavButtonRef }) => (
    <div className="main-header">
        <IconButton
            className="responsive-nav-button"
            ref={openNavButtonRef as any}
            onClick={openMenu}
            label="Open the navigation menu"
            icon={mdiMenu}
            emphasis="low"
        />
        <HomeLogoLink />
        <Match path="/product/*">
            {({ match }) =>
                match && (
                    <>
                        <MaterialThemeSwitcher />
                        <LumxVersion />
                    </>
                )
            }
        </Match>
        <SearchButton />
    </div>
);
