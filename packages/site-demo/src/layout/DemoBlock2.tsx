import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';
import { mdiCodeTags } from '@lumx/icons';
import classNames from 'classnames';
import React, { ReactChild, ReactElement, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Highlight from 'react-highlight';
import AngularTemplate from 'react-angular';


// Code highlighting style
import 'highlight.js/styles/github.css';

interface IDemoBlock2Props {
    demo: string,
    disableGrid: boolean;
    engine: string;
    location: { pathname: string };
    sourceCode: string;
    withThemeSwitcher: boolean;
}

interface IHasTheme { theme: Theme };

interface IDemoModule {
    default: React.FC<IHasTheme>;
}


function loadReactDemo(path: string, demo: string): Promise<IDemoModule> {
    return import(
        /* webpackMode: "lazy" */
        `content/${path.replace(/^\//, '')}/react/${demo}`
    );
}

async function loadAngularjsDemo(path: string, demo: string): Promise<IDemoModule> {
    const controllerModule = await import(
        /* webpackMode: "lazy" */
        `content/${path.replace(/^\//, '')}/angularjs/controller.js`
    );
    //require('@lumx/demo/layout/demo-block_directive');
    const template = require(
        `content/${path.replace(/^\//, '')}/angularjs/partials/${demo}.html`
    );
    return {
        default({ theme }: IHasTheme) {
            let container;

            useEffect(() => {
                if (!container) { return; }

                container.$scope.theme = theme;
                container.$scope.$apply();
            }, [container, theme]);

            return (
                <AngularTemplate
                    ref={(c) => container = c}
                    template={template}
                    controller={controllerModule.default}
                    controllerAs="vm"
                    scope={{ theme }}
                />
            );
        }
    };
}

const useLoadDemo = (path: string, engine: string, demo: string): IDemoModule | null | undefined => {
    const [Demo, setDemo] = useState<IDemoModule | null>();

    useEffect((): void => {
        (async (): Promise<void> => {
            setDemo(undefined);
            try {
                setDemo(
                    engine === 'react'
                      ? await loadReactDemo(path, demo)
                      : await loadAngularjsDemo(path, demo)
                );
            } catch (exception) {
                setDemo(null);
            }
        })();
    }, [path, engine, demo]);

    return Demo;
};

const DemoBlock2: React.FC<IDemoBlock2Props> = ({
    demo,
    disableGrid = false,
    engine,
    location,
    sourceCode,
    withThemeSwitcher = false,
}: IDemoBlock2Props): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean): void => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = (): void => setShowCode(!showCode);

    const Demo = useLoadDemo(location.pathname, engine, demo);

    return (
        <div className="demo-block">
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-theme-background-dark-N')}>
                <div className={disableGrid ? '' : 'demo-grid'}>
                    {Demo && <Demo.default theme={theme} />}
                </div>
            </div>
            <div className="demo-block__toolbar">
                <div className="demo-block__code-toggle">
                    <Button emphasis={Emphasis.low} leftIcon={mdiCodeTags} onClick={toggleShowCode}>
                        {showCode ? 'Hide code' : 'Show code'}
                    </Button>
                </div>

                {withThemeSwitcher && (
                    <div className="demo-block__theme-toggle">
                        <Switch position={SwitchPosition.right} checked={theme === Theme.dark} onToggle={toggleTheme}>
                            Dark Background
                        </Switch>
                    </div>
                )}
            </div>

            {showCode && sourceCode && (
                <div className="demo-block__code">
                    <Highlight className="javascript jsx">{sourceCode.replace(/\\n/g, '\n')}</Highlight>
                </div>
            )}
        </div>
    );
};

const DemoBlock2WithRouter = withRouter(DemoBlock2);

export { DemoBlock2WithRouter as DemoBlock2 };
