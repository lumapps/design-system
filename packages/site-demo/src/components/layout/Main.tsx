import React from 'react';
import { Match } from '@reach/router';
import { ErrorBoundary } from '@lumx/demo/components/ErrorBoundary';
import { LumxVersion } from '@lumx/demo/components/LumxVersion';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';

export const Main: React.FC = ({ children }) => (
    <main className="main">
        <div className="main__wrapper">
            <div className="main-header">
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
            </div>
            <div className="main-content">
                <div className="main-content__wrapper">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </div>
        </div>
    </main>
);
