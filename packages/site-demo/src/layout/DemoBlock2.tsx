import { Button, Emphasis, Switch, SwitchPosition, Theme } from '@lumx/react';
import { mdiCodeTags } from '@lumx/icons';
import classNames from 'classnames';
import React, { ReactChild, ReactElement, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Highlight from 'react-highlight';

// Code highlighting style
import 'highlight.js/styles/github.css';

interface IDemoBlock2Props {
    demo: string,
    disableGrid: boolean;
    location: { pathname: string };
    sourceCode: string;
    withThemeSwitcher: boolean;
}

const useLoadContent = (path: string): ReactElement | null | undefined => {
    const [content, setContent] = useState<ReactElement | null>();

    useEffect((): void => {
        (async (): Promise<void> => {
            setContent(undefined);
            try {
                const loadedContent = await import(
                    /* webpackMode: "eager" */
                    /* webpackChunkName: "content/[request]" */
                    `content/${path}`
                );
                setContent(React.createElement(loadedContent.default, {}, null));
            } catch (exception) {
                setContent(null);
            }
        })();
    }, [path]);

    return content;
};

const DemoBlock2: React.FC<IDemoBlock2Props> = ({
    demo,
    disableGrid = false,
    location,
    sourceCode,
    withThemeSwitcher = false,
}: IDemoBlock2Props): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean): void => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = (): void => setShowCode(!showCode);

    const engine = 'react';

    const content = useLoadContent(`${location.pathname.slice(1)}/${engine}/${demo}`);

    // const content = children(theme);
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

const DemoBlock2WithRouter = withRouter(DemoBlock2);

export { DemoBlock2WithRouter as DemoBlock2 };
