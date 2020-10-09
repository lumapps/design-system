import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Main } from './components/layout/Main';
import { MainNav } from './components/layout/MainNav';

/**
 * The main application component.
 *
 * @return The main application component.
 */
const App: React.FC = (): ReactElement => {
    return (
        <Router basename={window.PUBLIC_PATH}>
            <Route path="/:path*">
                <MainNav />
            </Route>
            <ErrorBoundary>
                <Main />
            </ErrorBoundary>
        </Router>
    );
};

export { App };
