import { useHighlightedCode } from '@lumx/demo/components/layout/utils/useHighlightedCode';
import { Engine, EngineContext } from '@lumx/demo/context/engine';

import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';

import classNames from 'classnames';
import get from 'lodash/get';
import React, { ReactNode, useContext, useEffect, useState } from 'react';

import AngularTemplate from 'react-angular';

interface DemoBlockProps {
    children?: ReactNode;
    demo?: string;
    engine?: string;
    code?: Code;
    withThemeSwitcher?: boolean;
}

interface HasTheme {
    theme: Theme;
}

// tslint:disable-next-line:interface-over-type-literal
type Module = {};

type NullModule = Module;

type DemoModule = Module & {
    default: React.FC<HasTheme>;
};

type AngularControllerModule = Module & {
    DemoController(): void;
};

type Code =
    | undefined
    | {
          react?: {
              demo?: DemoModule | NullModule;
              code?: string;
          };
          angularjs?: {
              demo?: {
                  controller?: AngularControllerModule | NullModule;
                  template?: string | NullModule;
              };
              code?: string;
          };
      };

function loadReactDemo(code: Code): DemoModule | null {
    const demo = code?.react?.demo;
    if (!demo || !('default' in demo)) {
        return null;
    }
    return demo;
}

function loadAngularjsDemo(code: Code): DemoModule | null {
    const controllerModule = code?.angularjs?.demo?.controller;
    const template = code?.angularjs?.demo?.template;
    if (!template || !(typeof template === 'string') || !controllerModule || !('DemoController' in controllerModule)) {
        return null;
    }

    return {
        default({ theme }: HasTheme) {
            let container: any;

            useEffect(() => {
                if (!container) {
                    return;
                }

                container.$scope.theme = theme;
                container.$scope.$apply();
            }, [container, theme]);

            return (
                <AngularTemplate
                    ref={(c: any) => (container = c)}
                    template={template}
                    controller={controllerModule.DemoController}
                    controllerAs="vm"
                    scope={{ theme }}
                />
            );
        },
    };
}

const useLoadDemo = (code: Code, engine: string): DemoModule | null => {
    const [demo, setDemo] = useState<DemoModule | null>(null);

    useEffect(() => {
        setDemo(engine === Engine.react ? loadReactDemo(code) : loadAngularjsDemo(code));
    }, [engine]);

    return demo;
};

function renderDemo(demo: DemoModule | null, theme: Theme, engine: string) {
    if (!demo) {
        return (
            <span>
                No demo available for <code>{engine}</code>.
            </span>
        );
    }
    return <demo.default theme={theme} />;
}

const DemoBlock: React.FC<DemoBlockProps> = ({ children, code, engine: propEngine, withThemeSwitcher = false }) => {
    const contextEngine = useContext(EngineContext).engine;
    const engine = propEngine || contextEngine;

    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (isChecked: boolean) => {
        setTheme(isChecked ? Theme.dark : Theme.light);
    };

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = () => setShowCode(!showCode);

    const demo = useLoadDemo(code, engine);
    const content = children || renderDemo(demo, theme, engine);
    const highlightedCode = useHighlightedCode(get(code, [engine, 'code']), engine === 'react' ? 'tsx' : 'html');

    return (
        <div className="demo-block">
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-color-background-dark-N')}>
                {content}
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
                            isChecked={theme === Theme.dark}
                            onChange={toggleTheme}
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
