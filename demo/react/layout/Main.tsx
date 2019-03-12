import React, { PureComponent } from 'react';

import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

interface IProps {
    component: string;
}

interface IState {
    component?: { view?: () => JSX.Element };
}

export class Main extends PureComponent<IProps, IState> {
    public state: IState = {
        component: { view: undefined },
    };

    public render(): JSX.Element {
        const { component: componentName }: IProps = this.props;

        if (!componentName) {
            return <div />;
        }

        const { component }: IState = this.state;

        if (component && component.view) {
            return <div className="main">{React.createElement(component.view!)}</div>;
        }

        return <div className="main">Loading demo for {componentName}...</div>;
    }

    // after the initial render, wait for module to load
    public async componentDidUpdate({ component: previousComponentName }: IProps) {
        const { component: componentName }: IProps = this.props;

        try {
            const { default: component }: { default: IState['component'] } = await this._loadComponent();
            this.setState({ component });
        } catch (exception) {
            if (componentName !== previousComponentName) {
                this.setState({ component: { view: undefined } });
            }

            console.error(exception);
        }
    }

    private _loadComponent(): Promise<{ default: IState['component'] }> {
        const { component: componentFolder }: IProps = this.props;
        if (!componentFolder) {
            return Promise.reject('No component to load');
        }

        const componentName: string = upperFirst(camelCase(componentFolder));

        return import(`../components/lx-${componentFolder}/Lx${componentName}Demo`);
    }
}
