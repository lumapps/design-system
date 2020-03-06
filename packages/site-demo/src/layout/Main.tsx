import { EngineProvider } from '@lumx/demo/context/engine';
import { ThemeProvider } from '@lumx/demo/context/theme';
import { ErrorBoundary } from '@lumx/demo/layout/ErrorBoundary';
import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { Alignment, Grid, GridItem, Orientation } from '@lumx/react';

import { EngineSelector } from './EngineSelector';
import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

const renderContent = ({ location }: RouteComponentProps) => {
    const path = location.pathname;
    if (!path.endsWith('/')) {
        return <Redirect to={`${path}/`} />;
    }
    return <MainContent path={path} />;
};

/**
 * The main component.
 *
 * @return The main component.
 */
export const Main: React.FC = () => {
    return (
        <div className="main">
            <EngineProvider>
                <div className="main__wrapper">
                    <div className="main-header">
                        <Grid orientation={Orientation.horizontal} hAlign={Alignment.center}>
                            <GridItem>
                                <Grid orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                    <span className="lumx-typography-overline lumx-spacing-margin-right-regular">
                                        Theme
                                    </span>
                                    <ThemeProvider>
                                        <ThemeSelector />
                                    </ThemeProvider>
                                </Grid>
                            </GridItem>
                            <Route path="/product/components*">
                                <EngineSelector />
                            </Route>
                        </Grid>
                    </div>

                    <div className="main-content">
                        <div className="main-content__wrapper">
                            <ErrorBoundary>
                                <Route path="*" render={renderContent} />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            </EngineProvider>
        </div>
    );
};
