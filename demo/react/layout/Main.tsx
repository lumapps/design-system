import React, { ReactElement, useEffect, useState } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { Category, DemoObject } from 'LumX/demo/react/constants';

import { DemoBlock } from './DemoBlock';
import { DemoHeader } from './DemoHeader';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps {
    /**
     * The active component to load the demo of.
     */
    activeComponent: string;
}

/**
 * Defines an ESModule as it will be loaded by the dynamic component loader.
 */
interface IESModule {
    /**
     * The `category` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the category of the demo.
     */
    category?: Category;

    /**
     * The `description` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the description of the demo.
     */
    description?: ReactElement;

    /**
     * The `title` export of our fake ESModule loaded by the dynamic component loader.
     * This export contains the title of the demo.
     */
    title: string;

    /**
     * Any other export of our fake ESModule loaded by the dynamic component loader.
     * These exports contains each a title, a description of the demo and the path to the file containing the demo.
     */
    demos: { [demoName: string]: DemoObject };
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Load the demo component corresponding to the currently active component.
 *
 * @param             componentFolderName The name of the component to load.
 * @return The promise of the dynamic load of the component.
 */
async function _loadComponent(componentFolderName: IProps['activeComponent']): Promise<IESModule> {
    if (isEmpty(componentFolderName)) {
        return Promise.reject('No component to load');
    }

    return import(`../components/${componentFolderName}`);
}

/////////////////////////////

/**
 * The main display component.
 * This component is in charge of displaying the active component demo page.
 * To do so, it will receive the name of the active component and will dynamically load the demo component from this
 * name.
 *
 * @return The main component.
 */
const Main: React.FC<IProps> = ({ activeComponent }: IProps): ReactElement => {
    const [demo, setDemo]: [IESModule | undefined, (demo: IESModule | undefined) => void] = useState();

    useEffect((): void => {
        const loadComponent: () => Promise<void> = async (): Promise<void> => {
            try {
                const loadedDemo: IESModule = await _loadComponent(activeComponent);
                setDemo(loadedDemo);
            } catch (exception) {
                setDemo(undefined);

                console.error(exception);
            }
        };

        loadComponent();
    }, [activeComponent]);

    if (demo === undefined || isEmpty(demo)) {
        return (
            <div className="main">
                <div className="main__wrapper">
                    {!isEmpty(activeComponent) && <span>Loading demo for {activeComponent}...</span>}
                </div>
            </div>
        );
    }

    const demoHeader: ReactElement | null = !isEmpty(demo.title) ? (
        <DemoHeader category={demo.category} demoTitle={demo.title}>
            {demo.description}
        </DemoHeader>
    ) : null;

    return (
        <div className="main">
            <div className="main__wrapper">
                {demoHeader}

                <div className="mt++">
                    {Object.keys(demo.demos).map(
                        (key: string, index: number): ReactElement => {
                            const { description, files, title }: DemoObject = demo.demos[key];

                            return (
                                <DemoBlock
                                    key={key}
                                    className={classNames({ 'mt+++': index > 0 })}
                                    blockTitle={title}
                                    demoName={key}
                                    demoPath={activeComponent}
                                    files={files}
                                >
                                    {description}
                                </DemoBlock>
                            );
                        },
                    )}
                </div>
            </div>
        </div>
    );
};

/////////////////////////////

export { Main };
