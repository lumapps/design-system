import React, { ReactElement } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { Alignment, Grid, GridItem, Orientation } from '@lumx/react';

import { Engine, Theme } from '@lumx/demo/constants';

import { IGenericProps } from '@lumx/react/utils';

import { EngineSelector } from './EngineSelector';
import { MainContent } from './MainContent';
import { ThemeSelector } from './ThemeSelector';

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The current selected engine.
     */
    engine: Engine;
    /**
     * The current selected theme.
     */
    theme: Theme;
    /**
     * The function to change the engine.
     * When the engine selector is used, this function is called to update the current engine.
     */
    changeEngine(engine: Engine): void;
    /**
     * The function to change the theme.
     * When the theme selector is used, this function is called to update the current theme.
     */
    changeTheme(theme: Theme): void;
}

const renderContent = (engine: Engine) => ({ location }: RouteComponentProps) => {
    const path = location.pathname;
    if (!path.endsWith('/')) {
        return <Redirect to={path + '/'} />;
    }
    return <MainContent engine={engine} path={path} />;
};

/**
 * The main component.
 *
 * @return The main component.
 */
const Main: React.FC<IProps> = ({ changeEngine, changeTheme, engine, theme }: IProps): ReactElement => {
    return (
        <div className="main">
            <div className="main__wrapper">
                <div className="main-header">
                    <Grid orientation={Orientation.horizontal} hAlign={Alignment.center}>
                        <GridItem>
                            <Grid orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                <span className="lumx-typography-overline lumx-spacing-margin-right-regular">
                                    Theme
                                </span>
                                <ThemeSelector changeTheme={changeTheme} theme={theme} />
                            </Grid>
                        </GridItem>
                        <EngineSelector changeEngine={changeEngine} engine={engine} />
                    </Grid>
                </div>

                <div className="main-content">
                    <div className="main-content__wrapper">
                        <Route path="*" render={renderContent(engine)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Main };
