import { useEffect } from 'react';

import { MainHeader } from './MainHeader/MainHeader';
import { MainContent } from './MainContent/MainContent';
import { MainNav } from './MainNav/MainNav';
import { useResponsiveNavState } from './MainNav/useResponsiveNavState';

import './Layout.scss';

interface Props {
    location?: Location;
    children?: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children, location }) => {
    // Remove tabIndex on gatsby focus wrapper that breaks focus when clicking on non focusable elements.
    // https://github.com/gatsbyjs/gatsby/issues/29037
    useEffect(() => {
        document.getElementById('gatsby-focus-wrapper')?.removeAttribute('tabIndex');
    }, []);

    // Handle responsive menu open/close.
    const { openNavButtonRef, closeNavButtonRef, isMenuOpen, openMenu, closeMenu } = useResponsiveNavState();

    return (
        <>
            <MainNav
                location={location}
                closeMenu={closeMenu}
                isMenuOpen={isMenuOpen}
                closeNavButtonRef={closeNavButtonRef}
            />
            <main className="main">
                <div className="main__wrapper">
                    <MainHeader openNavButtonRef={openNavButtonRef} openMenu={openMenu} />
                    <MainContent>{children}</MainContent>
                </div>
            </main>
        </>
    );
};
