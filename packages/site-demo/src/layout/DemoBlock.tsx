import { useHighlightedCode } from '@lumx/demo/layout/utils/useHighlightedCode';

import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';

import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

import AngularTemplate from 'react-angular';

interface IDemoBlockProps {
    demo: string;
    engine: string;
    code: ICode;
    withThemeSwitcher: boolean;
}

interface IHasTheme {
    theme: Theme;
}

interface IDemoModule {
    default: React.FC<IHasTheme>;
}

interface ICode {
    react: {
        demo: Promise<IDemoModule>;
        code: string;
    };
    angularjs: {
        demo: {
            controller: Promise<{ DemoController(): void }>;
            template: Promise<IDemoModule>;
        };
        code: string;
    };
}

async function loadReactDemo(code: ICode): Promise<IDemoModule | null> {
    const demo = await code.react.demo;
    if (!demo || !demo.default) {
        return null;
    }
    return demo;
}

async function loadAngularjsDemo(code: ICode): Promise<IDemoModule | null> {
    const { DemoController } = await code.angularjs.demo.controller;
    const template = await code.angularjs.demo.template;
    if (!template || !DemoController) {
        return null;
    }

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

const useLoadDemo = (code: ICode, engine: string): IDemoModule | null | undefined => {
    const [demo, setDemo] = useState<IDemoModule | null>();

    useEffect(() => {
        (async () => {
            setDemo(undefined);
            try {
                setDemo(engine === 'react' ? await loadReactDemo(code) : await loadAngularjsDemo(code));
            } catch (exception) {
                setDemo(null);
            }
        })();
    }, [engine]);

    return demo;
};

function renderDemo(demo: IDemoModule | null | undefined, theme: Theme, engine: string) {
    if (demo === undefined) {
        return (
            <span>
                Loading demo for <code>{engine}</code>...
            </span>
        );
    }
    if (demo === null) {
        return (
            <span>
                No demo available for <code>{engine}</code>.
            </span>
        );
    }
    return <demo.default theme={theme} />;
}

const DemoBlock: React.FC<IDemoBlockProps> = ({
    code,
    engine,
    withThemeSwitcher = false,
}: IDemoBlockProps): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean): void => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = (): void => setShowCode(!showCode);

    const demo = useLoadDemo(code, engine);

    const highlightedCode = useHighlightedCode(code[engine].code, engine === 'react' ? 'tsx' : 'html');

    return (
        <div className="demo-block">
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-theme-background-dark-N')}>
                {renderDemo(demo, theme, engine)}
            </div>
            <div className="demo-block__toolbar">
                <div className="demo-block__code-toggle">
                    <Button
                        disabled={!highlightedCode}
                        emphasis={Emphasis.low}
                        leftIcon={mdiCodeTags}
                        onClick={toggleShowCode}
                    >
                        {showCode ? 'Hide code' : 'Show code'}
                    </Button>
                </div>

                {withThemeSwitcher && (
                    <div className="demo-block__theme-toggle">
                        <Switch
                            disabled={!demo}
                            position={SwitchPosition.right}
                            checked={theme === Theme.dark}
                            onToggle={toggleTheme}
                        >
                            Dark Background
                        </Switch>
                    </div>
                )}
            </div>

            {showCode && highlightedCode && (
                <div className="demo-block__code">
                    <pre>
                        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </pre>
                </div>
            )}
        </div>
    );
};

export { DemoBlock };
