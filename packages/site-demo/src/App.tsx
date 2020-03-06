import React, { ReactElement } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from './layout/ErrorBoundary';
import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';

/**
 * The main application component.
 *
 * @return The main application component.
 */
export const App: React.FC = (): ReactElement => {
    return (
        <Router>
            <MainNav />

            <ErrorBoundary>
                <Main />
            </ErrorBoundary>
        </Router>
    );
};
