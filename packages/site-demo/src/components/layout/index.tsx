import React from 'react';
import { Main } from './Main';
import { MainNav } from './MainNav';

interface Props {
    location?: Location;
}

const Layout: React.FC<Props> = ({ children, location }) => (
    <div className="app">
        <MainNav location={location} />
        <Main>{children}</Main>
    </div>
);

export default Layout;
