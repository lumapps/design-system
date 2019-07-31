import React, { ReactElement, useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';

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

    return <>{demo}</>;
};

export { MainContent };
