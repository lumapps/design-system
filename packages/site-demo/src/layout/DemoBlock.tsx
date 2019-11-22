import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';
import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import AngularTemplate from 'react-angular';
import Highlight from 'react-highlight';
import { withRouter } from 'react-router-dom';

// Code highlighting style
import 'highlight.js/styles/github.css';

interface IDemoBlockProps {
    demo: string;
    disableGrid: boolean;
    engine: string;
    location: { pathname: string };
    sourceCode: string;
    withThemeSwitcher: boolean;
}

interface IHasTheme {
    theme: Theme;
}

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
    const { DemoController } = await import(
        /* webpackMode: "lazy" */
        `content/${path.replace(/^\//, '')}/angularjs/controller.js`
    );
    const { default: template } = await import(`content/${path.replace(/^\//, '')}/angularjs/${demo}.html`);

    return {
        default({ theme }: IHasTheme) {
            let container;

            useEffect(() => {
                if (!container) {
                    return;
                }

                container.$scope.theme = theme;
                container.$scope.$apply();
            }, [container, theme]);

            return (
                <AngularTemplate
                    ref={(c) => (container = c)}
                    template={template}
                    controller={DemoController}
                    controllerAs="vm"
                    scope={{ theme }}
                />
            );
        },
    };
}

const useLoadDemo = (path: string, engine: string, demo: string): IDemoModule | null | undefined => {
    const [Demo, setDemo] = useState<IDemoModule | null>();

    useEffect((): void => {
        (async (): Promise<void> => {
            setDemo(undefined);
            try {
                setDemo(engine === 'react' ? await loadReactDemo(path, demo) : await loadAngularjsDemo(path, demo));
            } catch (exception) {
                setDemo(null);
            }
        })();
    }, [path, engine, demo]);

    return Demo;
};

const DemoBlock: React.FC<IDemoBlockProps> = ({
    demo,
    disableGrid = false,
    engine,
    location,
    sourceCode,
    withThemeSwitcher = false,
}: IDemoBlockProps): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean): void => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = (): void => setShowCode(!showCode);

    const Demo = useLoadDemo(location.pathname, engine, demo);

    if (Demo === undefined) {
        return (
            <span>
                Loading demo for <code>{engine}</code>...
            </span>
        );
    }
    if (Demo === null) {
        return (
            <span>
                No demo available for <code>{engine}</code>.
            </span>
        );
    }

    return (
        <div className="demo-block">
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-theme-background-dark-N')}>
                <div className={disableGrid ? '' : 'demo-grid'}>{Demo && <Demo.default theme={theme} />}</div>
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

const DemoBlockWithRouter = withRouter(DemoBlock);

export { DemoBlockWithRouter as DemoBlock };
