import React, { ReactElement, useEffect, useState } from 'react';

import { capitalize, last } from 'lodash';
import isEmpty from 'lodash/isEmpty';

import { PropTable } from 'LumX/demo/react/layout/PropTable';
import { propsByComponent } from 'propsMetadata';

/**
 * Convert content path to component name in capitalized camel case.
 * @param path the content path.
 * @return the component name.
 */
function toComponentName(path: string): string | undefined {
    const comp = last(path.split('/'));
    if (comp) {
        return comp
            .split(' ')
            .map(capitalize)
            .join();
    }
    return undefined;
}

/**
 * The main content component.
 *
 * @return The main content component.
 */
const MainContent = ({ path }: { path: string }): ReactElement => {
    const [demo, setDemo] = useState<ReactElement>();

    useEffect((): void => {
        (async (): Promise<void> => {
            try {
                const loadedDemo = await import(/* webpackMode: "eager" */ `../doc/${path.replace(' ', '-')}`);
                setDemo(React.createElement(loadedDemo.default, {}, null));
            } catch (exception) {
                setDemo(undefined);
            }
        })();
    }, [path]);

    if (demo === undefined || isEmpty(demo)) {
        return <span>Loading demo for {path}...</span>;
    }

    const componentName = toComponentName(path);

    return (
        <>
            {demo}
            <h1>Properties</h1>
            <PropTable propertyList={propsByComponent[componentName]} />
        </>
    );
};

export { MainContent };
