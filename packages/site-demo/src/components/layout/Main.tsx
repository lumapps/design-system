import { ErrorBoundary } from '@lumx/demo/components/ErrorBoundary';
import { Alignment, FlexBox, Orientation } from '@lumx/react';
import { Match } from '@reach/router';
import React from 'react';
import { GlobalThemeSelector } from '@lumx/demo/components/GlobalThemeSelector';
import { LumxVersion } from '@lumx/demo/components/LumxVersion';

export const Main: React.FC = ({ children }) => (
    <main className="main">
        <div className="main__wrapper">
            <header className="main-header">
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                        <span className="lumx-typography-overline lumx-spacing-margin-right-regular">Theme</span>
                        <GlobalThemeSelector />
                    </FlexBox>

                    <Match path="/product/components/*">
                        {({ match }) =>
                            match && (
                                <FlexBox marginAuto={Alignment.left}>
                                    <LumxVersion />
                                </FlexBox>
                            )
                        }
                    </Match>
                </FlexBox>
            </header>
            <div className="main-content">
                <div className="main-content__wrapper">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </div>
        </div>
    </main>
);
