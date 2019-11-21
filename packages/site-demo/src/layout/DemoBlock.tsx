import { mdiCodeTags } from '@lumx/icons';
import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';
import classNames from 'classnames';
import React, { ReactChild, ReactElement, useState } from 'react';
import Highlight from 'react-highlight';

// Code highlighting style
import 'highlight.js/styles/github.css';

type ThemeConsumer = (theme: Theme) => ReactChild;

interface IDemoBlockProps {
    children: ThemeConsumer;
    disableGrid: boolean;
    withThemeSwitcher: boolean;
    sourceCode: string;
}

const DemoBlock: React.FC<IDemoBlockProps> = ({
    children,
    disableGrid = false,
    withThemeSwitcher = false,
    sourceCode,
}: IDemoBlockProps): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean): void => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = (): void => setShowCode(!showCode);

    const content = children(theme);
    return (
        <div className="demo-block">
            <div className={classNames('demo-block__content', theme === Theme.dark && 'lumx-theme-background-dark-N')}>
                <div className={disableGrid ? '' : 'demo-grid'}>{content}</div>
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

export { DemoBlock };
