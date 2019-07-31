import React, { ReactElement, useEffect, useState } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';

import { Theme } from 'LumX/demo/constants';
import { Category, DemoObject } from 'LumX/demo/react/constants';

import { IGenericProps } from 'LumX/core/react/utils';

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
 * Defines an ESModule as it will be loaded by the dynamic component loader.
 */
interface IESModule {
    /**
     * The `category` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the category of the demo.
     */
    category?: Category;

    /**
     * The `description` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the description of the demo.
     */
    description?: ReactElement;

    /**
     * The `title` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the title of the demo.
     */
    title: string;

    /**
     * Any other export of our fake ESModule loaded by the dynamic component loader.
     * These exports contains each a title, a description of the demo and the path to the file containing the demo.
     */
    demos: { [demoName: string]: DemoObject };
}

/**
 * Load the demo component corresponding to the currently active component.
 *
 * @param             componentFolderName The name of the component to load.
 * @return The promise of the dynamic load of the component.
 */
async function _loadComponent(componentFolderName: string): Promise<IESModule> {
    if (isEmpty(componentFolderName)) {
        return Promise.reject('No component to load');
    }

    return import(`../components/${componentFolderName}`);
}

const Content = ({ activeComponent }: { activeComponent: string }): ReactElement => {
    console.log(activeComponent);

    const [demo, setDemo] = useState<IESModule>();

    useEffect((): void => {
        const loadComponent = async (): Promise<void> => {
            try {
                const loadedDemo: IESModule = await _loadComponent(activeComponent.replace(' ', '-'));
                setDemo(loadedDemo);
            } catch (exception) {
                setDemo(undefined);

                console.error(exception);
            }
        };

        loadComponent();
    }, [activeComponent]);

    if (demo === undefined || isEmpty(demo)) {
        return (
            <div className="main">
                <div className="main__wrapper">
                    {!isEmpty(activeComponent) && <span>Loading demo for {activeComponent}...</span>}
                </div>
            </div>
        );
    }
    return <h1>{activeComponent.replace(/^\w/, (c: string) => c.toLocaleUpperCase())}</h1>;
};

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
                    <div className="main-content__wrapper">
                        <Route
                            path="/product/components/:component"
                            render={({ match }: RouteComponentProps): ReactElement => (
                                <Content activeComponent={match.params.component} />
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Main };
