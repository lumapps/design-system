import React, { useEffect } from 'react';
import { Main } from './Main/Main';
import { MainNav } from './MainNav/MainNav';

interface Props {
    location?: Location;
}

export const Layout: React.FC<Props> = ({ children, location }) => {
    // Remove tabIndex on gatsby focus wrapper that breaks focus when clicking on non focusable elements.
    // https://github.com/gatsbyjs/gatsby/issues/29037
    useEffect(() => {
        document.getElementById('gatsby-focus-wrapper')?.removeAttribute('tabIndex');
    }, []);
    return (
        <div className="layout">
            <MainNav location={location} />
            <Main>{children}</Main>
        </div>
    );
};
