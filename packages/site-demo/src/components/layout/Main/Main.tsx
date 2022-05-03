import React from 'react';
import { MainHeader } from '@lumx/demo/components/layout/Main/MainHeader/MainHeader';
import { MainContent } from '@lumx/demo/components/layout/Main/MainContent/MainContent';

import './Main.scss';

export const Main: React.FC = ({ children }) => (
    <main className="main">
        <div className="main__wrapper">
            <MainHeader />
            <MainContent>{children}</MainContent>
        </div>
    </main>
);
