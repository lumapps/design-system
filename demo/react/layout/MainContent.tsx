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

const useLoadContent = (path: string): ReactElement | null | undefined => {
    const [content, setContent] = useState<ReactElement | null>();

    useEffect((): void => {
        (async (): Promise<void> => {
            try {
                const loadedContent = await import(/* webpackMode: "eager" */ `../doc/${path}`);
                setContent(React.createElement(loadedContent.default, {}, null));
            } catch (exception) {
                setContent(null);
            }
        })();
    }, [path]);

    return content;
};

/**
 * The main content component.
 *
 * @return The main content component.
 */
const MainContent = ({ path }: { path: string }): ReactElement => {
    const content = useLoadContent(path);
    return renderContent(path, content);
};

export { MainContent };
