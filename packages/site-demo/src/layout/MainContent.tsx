import React, { ReactElement, useEffect, useState } from 'react';

const renderContent = (path: string, demo: ReactElement | null | undefined): ReactElement => {
    if (demo === undefined) {
        return (
            <span>
                Loading content for <code>{path}</code>...
            </span>
        );
    }
    if (demo === null) {
        return (
            <span>
                Could not load content for <code>{path}</code>
            </span>
        );
    }

    return demo;
};

const useLoadContent = (engine: string, path: string): ReactElement | null | undefined => {
    const [content, setContent] = useState<ReactElement | null>();

    useEffect((): void => {
        (async (): Promise<void> => {
            setContent(undefined);
            try {
                const loadedContent = await import(
                    /* webpackMode: "lazy" */
                    /* webpackChunkName: "content/[request]" */
                    `content/${path}`
                );
                setContent(React.createElement(loadedContent.default, { engine }, null));
            } catch (exception) {
                setContent(null);
            }
        })();
    }, [engine, path]);

    return content;
};

/**
 * The main content component.
 *
 * @return The main content component.
 */
const MainContent = ({ engine, path }: { engine: string, path: string }): ReactElement => {
    const content = useLoadContent(engine, path);

    return renderContent(path, content);
};

export { MainContent };
