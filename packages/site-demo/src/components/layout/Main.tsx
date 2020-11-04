import { ErrorBoundary } from '@lumx/demo/components/ErrorBoundary';
import { LumxVersion } from '@lumx/demo/components/LumxVersion';
import { Alignment, FlexBox, Orientation } from '@lumx/react';
import { Match } from '@reach/router';
import React from 'react';

export const Main: React.FC = ({ children }) => (
    <main className="main">
        <div className="main__wrapper">
            <div className="main-header">
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
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
            </div>
            <div className="main-content">
                <div className="main-content__wrapper">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </div>
        </div>
    </main>
);
