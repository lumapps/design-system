import { EngineProvider } from '@lumx/demo/context/engine';
import { GlobalThemeProvider } from '@lumx/demo/context/global-theme';
import { ErrorBoundary } from '@lumx/demo/layout/ErrorBoundary';
import React, { ReactElement } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { Alignment, FlexBox, Orientation } from '@lumx/react';

import { EngineSelector } from './EngineSelector';
import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

const renderContent = ({ location }: RouteComponentProps) => {
    const path = location.pathname;
    if (!path.endsWith('/')) {
        return <Redirect to={path + '/'} />;
    }
    return <MainContent path={path} />;
};

/**
 * The main component.
 *
 * @return The main component.
 */
const Main: React.FC = (): ReactElement => {
    return (
        <div className="main">
            <EngineProvider>
                <GlobalThemeProvider>
                    <div className="main__wrapper">
                        <div className="main-header">
                            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                <FlexBox fillSpace>
                                    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                        <span className="lumx-typography-overline lumx-spacing-margin-right-regular">
                                            Theme
                                        </span>
                                        <ThemeSelector />
                                    </FlexBox>
                                </FlexBox>
                                <Route path="/product/components*">
                                    <EngineSelector />
                                </Route>
                            </FlexBox>
                        </div>

                        <div className="main-content">
                            <div className="main-content__wrapper">
                                <ErrorBoundary>
                                    <Route path="*" render={renderContent} />
                                </ErrorBoundary>
                            </div>
                        </div>
                    </div>
                </GlobalThemeProvider>
            </EngineProvider>
        </div>
    );
};

export { Main };
