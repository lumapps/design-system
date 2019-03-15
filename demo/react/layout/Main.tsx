import React, { useEffect, useState } from 'react';

import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps {
    /**
     * The active component to load the demo of.
     */
    activeComponent: string;
}

/**
 * Defines an ESModule as it will be loaded by the dynamic component loader.
 */
interface IESModule {
    /**
     * The default export of our fake ESModule loaded by the dynamic component loader.
     */
    default?: () => JSX.Element;
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Load the demo component corresponding to the currently active component.
 *
 * @return {Promise<IESModule>} The promise of the dynamic load of the component.
 */
function _loadComponent(componentFolderName: IProps['activeComponent']): Promise<IESModule> {
    if (!componentFolderName) {
        return Promise.reject('No component to load');
    }

    const componentName: string = upperFirst(camelCase(componentFolderName));

    return import(`../components/lx-${componentFolderName}/Lx${componentName}Demo`);
}

/////////////////////////////

/**
 * The main display component.
 * This component is in charge of displaying the active component demo page.
 * To do so, it will receive the name of the active component and will dynamically load the demo component from this
 * name.
 */
const Main: React.FC<IProps> = ({ activeComponent }: IProps): JSX.Element => {
    const [demoComponent, setDemoComponent]: [IESModule['default'], any] = useState();

    useEffect((): void => {
        const loadComponent = async () => {
            try {
                const { default: newDemoComponent }: IESModule = await _loadComponent(activeComponent);
                setDemoComponent(newDemoComponent);
            } catch (exception) {
                setDemoComponent();

                console.error(exception);
            }
        };

        loadComponent();
    }, [activeComponent]);

    if (!activeComponent) {
        return <div />;
    }

    if (!isEmpty(demoComponent)) {
        return <div className="main">{demoComponent}</div>;
    }

    return <div className="main">Loading demo for {activeComponent}...</div>;
};

/////////////////////////////

export { Main };
