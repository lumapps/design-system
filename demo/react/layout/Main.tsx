import React, { ReactElement } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { Theme } from 'LumX/demo/constants';

import { IGenericProps } from 'LumX/core/react/utils';

import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
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
const Main: React.FC<IProps> = ({ changeTheme }: IProps): ReactElement => {
    return (
        <div className="main">
            <div className="main-wrapper">
                <div className="main-header">
                    <ThemeSelector changeTheme={changeTheme} />
                </div>

                <div className="main-content">
                    <Route
                        path="/:path*"
                        render={({ match }: RouteComponentProps): ReactElement => (
                            <MainContent path={match.params.path} />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export { Main };
