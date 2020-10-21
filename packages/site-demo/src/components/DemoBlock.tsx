import { HighlightedCode } from '@lumx/demo/components/HighlightedCode';
import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';
import isFunction from 'lodash/isFunction';

import classNames from 'classnames';
import React, { useState } from 'react';

interface DemoBlockProps {
    demo?: string;
    codeString?: string;
    withThemeSwitcher?: boolean;
    hasPlayButton?: boolean;
}

export const DemoBlock: React.FC<DemoBlockProps> = ({
    children,
    demo,
    codeString,
    withThemeSwitcher = false,
    hasPlayButton = false,
}) => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean) => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = () => setShowCode(!showCode);

    return (
        <div className={classNames('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-color-background-dark-N')}>
                {!children && (
                    <span>
                        Could not load demo <code>{demo}</code>.
                    </span>
                )}
                {isFunction(children) ? children({ theme }) : children}
            </div>
            <div className="demo-block__toolbar">
                <div className="demo-block__code-toggle">
                    <Button
                        disabled={!codeString}
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
                            disabled={!children}
                            position={SwitchPosition.right}
                            checked={theme === Theme.dark}
                            onToggle={toggleTheme}
                        >
                            Dark Background
                        </Switch>
                    </div>
                )}
            </div>

            {showCode && codeString && (
                <div className="demo-block__code">
                    <HighlightedCode codeString={codeString} language="tsx" />
                </div>
            )}
        </div>
    );
};
