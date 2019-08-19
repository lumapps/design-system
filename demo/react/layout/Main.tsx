import React, { ReactElement } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { Alignment, Button, ButtonEmphasis, Grid, GridItem, Orientation, Size } from 'LumX';
import { mdiAngularjs } from 'LumX/icons';

import { Theme } from 'LumX/demo/constants';

import { IGenericProps } from 'LumX/core/react/utils';

import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The current selected theme.
     */
    theme: Theme;
    /**
     * The function to change the theme.
     * When the theme selector is used, this function is called to update the current theme.
     */
    changeTheme(theme: Theme): void;
}

/**
 * The main component.
 *
 * @return The main component.
 */
const Main: React.FC<IProps> = ({ changeTheme, theme }: IProps): ReactElement => {
    return (
        <div className="main">
            <div className="main__wrapper">
                <div className="main-header">
                    <Grid wrap orientation={Orientation.horizontal} vAlign={Alignment.center} hAlign={Alignment.top}>
                        <GridItem>
                            <span className="lumx-typography-overline lumx-spacing-margin-right-regular">Theme</span>
                            <ThemeSelector changeTheme={changeTheme} theme={theme} />
                        </GridItem>
                        <Button
                            emphasis={ButtonEmphasis.low}
                            leftIcon={mdiAngularjs}
                            onClick={(): Window | null => window.open('http://ui.lumapps.com/')}
                            size={Size.s}
                        >
                            View Angularjs version
                        </Button>
                    </Grid>
                </div>

                <div className="main-content">
                    <div className="main-content__wrapper">
                        <Redirect push from="/" to="/product/foundations/colors" />
                        <Route
                            path="/:path*"
                            render={({ match }: RouteComponentProps): ReactElement => (
                                <MainContent path={match.params.path} />
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Main };
