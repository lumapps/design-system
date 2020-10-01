import React, { ReactElement } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

import { ErrorBoundary } from '@lumx/demo/components/ErrorBoundary';
import { LumxVersion } from '@lumx/demo/components/LumxVersion';
import { EngineProvider } from '@lumx/demo/context/engine';
import { GlobalThemeProvider } from '@lumx/demo/context/global-theme';
import { Alignment, FlexBox, Orientation } from '@lumx/react';

import { EngineSelector } from './EngineSelector';
import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

/**
 * The main component.
 *
 * @return The main component.
 */
export const Main: React.FC = (): ReactElement => {
    const { location } = useHistory();
    if (!location.pathname.endsWith('/')) {
        return <Redirect to={location.pathname + '/'} />;
    }

    return (
        <div className="main">
            <EngineProvider>
                <GlobalThemeProvider>
                    <div className="main__wrapper">
                        <div className="main-header">
                            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                    <span className="lumx-typography-overline lumx-spacing-margin-right-regular">
                                        Theme
                                    </span>
                                    <ThemeSelector />
                                </FlexBox>

                                <FlexBox marginAuto={Alignment.left}>
                                    <Route path="/product/components*">
                                        <EngineSelector />
                                        <LumxVersion />
                                    </Route>
                                </FlexBox>
                            </FlexBox>
                        </div>

                        <Route path="*">
                            <ErrorBoundary>
                                <MainContent />
                            </ErrorBoundary>
                        </Route>
                    </div>
                </GlobalThemeProvider>
            </EngineProvider>
        </div>
    );
};
