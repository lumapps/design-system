import React, { ReactChild, ReactElement, ReactNode, useEffect, useState } from 'react';

import { MDXProvider } from '@mdx-js/react';
import { capitalize } from 'lodash';

import { PropTable } from 'LumX/demo/react/layout/PropTable';

// @ts-ignore
import { propsByComponent } from 'props-loader!';

/**
 * Convert content path to component name in capitalized camel case.
 * @param path the content path.
 * @return the component name.
 */
function getComponentName(path: string): string | undefined {
    const RE_COMPONENT_PATH = /components\/(.*)/;
    const matches = path.match(RE_COMPONENT_PATH);
    if (matches) {
        const [, component] = matches;
        return component
            .split('-')
            .map(capitalize)
            .join('');
    }
    return undefined;
}

const mdxComponents = {
    // This prevents MDX from wrapping components in <MDXComponent>.
    wrapper: (elem: { children: ReactChild }): ReactNode => {
        return elem.children;
    },
};

const renderDemo = (path: string, demo: ReactElement | null | undefined): ReactElement => {
    return !demo ? (
        demo === undefined ? (
            <span>
                Loading content for <code>{path}</code>...
            </span>
        ) : (
            <span>
                Could not load content for <code>{path}</code>
            </span>
        )
    ) : (
        <MDXProvider components={mdxComponents}>{demo}</MDXProvider>
    );
};

const renderComponentProperties = (componentName: string): ReactElement => {
    const properties = propsByComponent[componentName];
    return properties ? (
        <PropTable propertyList={properties} />
    ) : (
        <span>Could not load properties for component {componentName}</span>
    );
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
    const demo = useLoadContent(path);

    const componentName = getComponentName(path);

    return (
        <>
            {renderDemo(path, demo)}

            {componentName && (
                <>
                    <h1 className="lumx-spacing-margin-top-huge">Properties</h1>
                    {renderComponentProperties(componentName)}
                </>
            )}
        </>
    );
};

export { MainContent };
