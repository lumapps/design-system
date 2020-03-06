import React, { ReactElement, useEffect, useState } from 'react';

import { LoadingContent } from '@lumx/demo/layout/LoadingContent';

type Content = ReactElement | null | undefined;

const renderContent = (path: string, content: Content): ReactElement => {
    if (content === undefined) {
        return <LoadingContent />;
    }
    if (content === null) {
        return (
            <span>
                Could not load content for <code>{path}</code>
            </span>
        );
    }

    return content;
};

const useLoadContent = (path: string): Content => {
    const [content, setContent] = useState<Content>(undefined);

    useEffect(() => {
        (async (): Promise<void> => {
            setContent(undefined);
            try {
                const loadedContent = await import(
                    /* webpackChunkName: "content/[request]" */
                    `content/${path.replace(/^\//, '')}`
                );
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
export const MainContent: React.FC<{ path: string }> = ({ path }) => {
    const content = useLoadContent(path);

    return renderContent(path, content);
};
