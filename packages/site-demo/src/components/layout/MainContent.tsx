import React, { ReactElement, useContext, useEffect, useState } from 'react';

import { LoadingContent } from '@lumx/demo/components/layout/LoadingContent';
import { EngineContext } from '@lumx/demo/context/engine';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

type Content = ReactElement | null | undefined;

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
export const MainContent: React.FC = () => {
    const { location } = useHistory();
    const content = useLoadContent(location.pathname);
    const { engine } = useContext(EngineContext);

    return (
        <div className={classNames('main-content', engine)}>
            <div className="main-content__wrapper">
                {content === undefined && <LoadingContent />}
                {content === null && (
                    <span>
                        Could not load content for <code>{location.pathname}</code>
                    </span>
                )}
                {content ? content : null}
            </div>
        </div>
    );
};
