import { useEffect } from 'react';
import upperFirst from 'lodash/upperFirst';

import { Message } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

import { MainHeader } from './MainHeader/MainHeader';
import { MainContent } from './MainContent/MainContent';
import { MainNav } from './MainNav/MainNav';
import { useResponsiveNavState } from './MainNav/useResponsiveNavState';
import { Framework, useFramework } from './FrameworkContext';

import './Layout.scss';

interface Props {
    location?: Location;
    children?: React.ReactNode;
    pageContext?: { frameworks?: Framework[] };
}

export const Layout: React.FC<Props> = ({ children, location, pageContext }) => {
    // Remove tabIndex on gatsby focus wrapper that breaks focus when clicking on non focusable elements.
    // https://github.com/gatsbyjs/gatsby/issues/29037
    useEffect(() => {
        document.getElementById('gatsby-focus-wrapper')?.removeAttribute('tabIndex');
    }, []);

    // Handle responsive menu open/close.
    const { openNavButtonRef, closeNavButtonRef, isMenuOpen, openMenu, closeMenu } = useResponsiveNavState();

    // Check if selected framework is supported on this page
    const { framework } = useFramework();
    const pageFrameworks = pageContext?.frameworks;

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
                    {/* Warning when selected framework is not supported on this page */}
                    {pageFrameworks && !pageFrameworks.includes(framework) && (
                        <Message kind="warning" hasBackground className={classNames.margin('vertical')}>
                            This page does not provide documentation for {upperFirst(framework)}
                        </Message>
                    )}
                    <MainContent>{children}</MainContent>
                </div>
            </main>
        </>
    );
};
