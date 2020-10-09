import { Code, DemoModule, useLoadDemo } from '@lumx/demo/components/DemoBlock/useLoadDemo';
import { useHighlightedCode } from '@lumx/demo/components/layout/utils/useHighlightedCode';
import { EngineContext } from '@lumx/demo/context/engine';

import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';

import classNames from 'classnames';
import get from 'lodash/get';
import React, { ReactNode, useContext, useState } from 'react';

interface DemoBlockProps {
    children?: ReactNode;
    demo?: string;
    engine?: string;
    code?: Code;
    withThemeSwitcher?: boolean;
}

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

export const DemoBlock: React.FC<DemoBlockProps> = ({
    children,
    code,
    engine: propEngine,
    withThemeSwitcher = false,
}) => {
    const contextEngine = useContext(EngineContext).engine;
    const engine = propEngine || contextEngine;

    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean) => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

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
