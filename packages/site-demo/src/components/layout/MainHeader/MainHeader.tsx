import { Ref } from 'react';
import { Match as Match_ } from '@reach/router';

import { mdiMenu } from '@lumx/icons';
import { IconButton } from '@lumx/react';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';
import { SearchButton } from '@lumx/demo/components/search/SearchButton';

import { LumxVersion } from './LumxVersion';
import './MainHeader.scss';

// TODO: replace with gatsby router (when updated to v4)
const Match = Match_ as any;

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
            {({ match }: any) =>
                match && (
                    <div className="main-header__extras">
                        <MaterialThemeSwitcher />
                        <LumxVersion />
                    </div>
                )
            }
        </Match>
        <SearchButton className="main-header__search-button" />
    </div>
);
