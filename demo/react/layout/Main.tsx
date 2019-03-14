import React from 'react';

import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
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
 * Defines the state of the component.
 */
interface IState {
    /**
     * The loaded demo component to display in the main display.
     */
    demoComponent?: { view?: () => JSX.Element };
}

/**
 * Defines an ESModule as it will be loaded by the dynamic component loader.
 */
interface IESModule {
    /**
     * The default export of our fake ESModule loaded by the dynamic component loader.
     */
    default: IState['demoComponent'];
}

/////////////////////////////

/**
 * The main display component.
 * This component is in charge of displaying the active component demo page.
 * To do so, it will receive the name of the active component and will dynamically load the demo component from this
 * name.
 */
class Main extends React.PureComponent<IProps, IState> {
    public state: IState = {
        demoComponent: { view: undefined },
    };

    public render(): JSX.Element {
        const { activeComponent: componentName }: IProps = this.props;
        if (!componentName) {
            return <div />;
        }

        const { demoComponent }: IState = this.state;

        if (!isEmpty(demoComponent) && isFunction(demoComponent!.view)) {
            return <div className="main">{React.createElement(demoComponent!.view!)}</div>;
        }

        return <div className="main">Loading demo for {componentName}...</div>;
    }

    /**
     * Each time the active component changes, change the main display (display the loading message and load the
     * corresponding demo component).
     *
     * @param {IProps} previousProps The previous props of the component (to be compared with the new one available
     *                               in `this.props`).
     */
    public async componentDidUpdate({ activeComponent: previousComponentName }: IProps) {
        const { activeComponent: componentName }: IProps = this.props;

        try {
            const { default: demoComponent }: IESModule = await this._loadComponent();
            this.setState({ demoComponent });
        } catch (exception) {
            if (componentName !== previousComponentName) {
                this.setState({ demoComponent: { view: undefined } });
            }

            console.error(exception);
        }
    }

    /**
     * Load the demo component corresponding to the currently active component.
     *
     * @return {Promise<IESModule>} The promise of the dynamic load of the component.
     */
    private _loadComponent(): Promise<IESModule> {
        const { activeComponent: componentFolderName }: IProps = this.props;
        if (!componentFolderName) {
            return Promise.reject('No component to load');
        }

        const componentName: string = upperFirst(camelCase(componentFolderName));

        return import(`../components/lx-${componentFolderName}/Lx${componentName}Demo`);
    }
}

/////////////////////////////

export { Main };
