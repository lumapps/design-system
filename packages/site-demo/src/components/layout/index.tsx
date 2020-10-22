import React from 'react';
import { Main } from './Main';
import { MainNav } from './MainNav';

interface Props {
    location?: Location;
}

const Layout: React.FC<Props> = ({ children, location }) => (
    <>
        <MainNav location={location} />
        <Main>{children}</Main>
    </>
);

export default Layout;
