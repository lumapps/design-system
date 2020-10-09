import React, { ReactElement, useContext, useEffect, useState } from 'react';

import { LoadingContent } from '@lumx/demo/components/layout/LoadingContent';
import { EngineContext } from '@lumx/demo/context/engine';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

type Content = ReactElement | null | undefined;

const useLoadContent = (path: string): Content => {
    const [content, setContent] = useState<Content>(undefined);

    useEffect(() => {
        (async (): Promise<void> => {
            setContent(undefined);
            try {
                const loadedContent = await import(
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

/**
 * The main content component.
 *
 * @return The main content component.
 */
export const MainContent: React.FC = () => {
    const { path = '' } = useParams();
    const content = useLoadContent(path);
    const { engine } = useContext(EngineContext);

    return (
        <div className={classNames('main-content', engine)}>
            <div className="main-content__wrapper">
                {content === undefined && <LoadingContent />}
                {content === null && (
                    <p>
                        Could not load content for <code>{path}</code>
                    </p>
                )}
                {content ? content : null}
            </div>
        </div>
    );
};
