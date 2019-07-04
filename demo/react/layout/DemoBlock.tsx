import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

import classNames from 'classnames';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tsx } from 'react-syntax-highlighter/dist/esm/languages/prism';
import { darcula as syntaxHighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

import { Button, ButtonEmphasis, Switch, SwitchPosition, Theme } from 'LumX';
import { IGenericProps } from 'LumX/core/react/utils';
import { mdiCodeTags } from 'LumX/icons';

/////////////////////////////

SyntaxHighlighter.registerLanguage('tsx', tsx);

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps extends IGenericProps {
    /**
     * The title of the demo block.
     */
    blockTitle?: string;

    /**
     * The description of the demo block.
     */
    children?: ReactNode;

    /**
     * The full name of the demo. When adding the '.tsx' extension, this will give the name of the file to load to
     * display the demo and the source code.
     */
    demoName: string;

    /**
     * The path to folder containing the demo files.
     */
    demoPath: string;

    /**
     * A list of complimentary files to load when displaying the source code.
     */
    files?: string[];
}

/**
 * Defines an ESModule as it will be loaded by the dynamic demo loader.
 */
interface IESModule {
    /**
     * The component of the demo.
     */
    default: { view(props: IGenericProps): JSX.Element };
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Load the demo component corresponding to the given demo name.
 *
 * @param             demoPath The path to the demo folder.
 * @param             demoName The name of the demo to load the component of.
 * @return The promise of the load of the demo component.
 */
async function _loadDemoComponent(demoPath: string, demoName: string): Promise<IESModule> {
    if (isEmpty(demoPath) || isEmpty(demoName)) {
        return Promise.reject('No demo component to load');
    }

    return import(`../components/${demoPath}/${demoName}.tsx`);
}

/**
 * Load the source code of the demo component corresponding to the given demo name.
 *
 * @param             demoPath The path to the demo folder.
 * @param             file     The name of the demo to load the source code of.
 * @return The promise of the load of the source code of the demo.
 */
async function _loadSourceCode(demoPath: string, file: string): Promise<IESModule> {
    if (isEmpty(demoPath) || isEmpty(file)) {
        return Promise.reject('No source code to load');
    }

    return import(`!!raw-loader!../components/${demoPath}/${file}`);
}

/**
 * Wrap a dynamic loading in a promise to be used in the component.
 *
 * @param load           The loading function to wrap.
 * @param   path           The path to the demo folder.
 * @param   file           The name of the file to load.
 * @param setState       The set state function to use with the response of the load.
 * @param   [defaultValue] The default value to set when an error occurred.
 * @return The promise of the load that will resolve with the loaded value (or the default one in case of
 *                   error).
 */
async function _load(
    load: (path: string, file: string) => Promise<IESModule>,
    path: string,
    file: string,
    // tslint:disable-next-line: no-any
    setState: (module: any) => void,
    defaultValue?: string,
    // tslint:disable-next-line: no-any
): Promise<any> {
    try {
        const loadedModule: IESModule = await load(path, file);
        setState(loadedModule.default);

        return loadedModule.default;
    } catch (exception) {
        setState(defaultValue);

        console.error(exception);

        return defaultValue;
    }
}

/////////////////////////////

/**
 * A block of demo in a demo page.
 * This component will display an interactive demo but also allow to display the source code of this demo.
 * You only have to provide the path to the wanted file (a valid path for the serving server of the demo site).
 *
 * @return The demo block component.
 */
const DemoBlock: React.FC<IProps> = ({
    blockTitle: title,
    children: description,
    className = '',
    demoName,
    demoPath,
    files = [],
}: IProps): ReactElement => {
    const [theme, setTheme] = useState(Theme.light);
    /**
     * Enable/disable the dark theme.
     * This is the callback function of the `onClick` event of the theme <Switch>.
     *
     * @param enabled Indicates if the dark theme should be enabled or not.
     */
    const setDarkTheme = (enabled: boolean): void => {
        setTheme(enabled ? Theme.dark : Theme.light);
    };

    const [shouldDisplayCode, setDisplayCode] = useState(false);
    /**
     * Toggle the display of the code in the demo block.
     */
    const toggleDisplayCode = (): void => {
        setDisplayCode(!shouldDisplayCode);
    };

    const [demoComponent, setDemoComponent]: [
        IESModule['default'] | undefined,
        (demoComponent: IESModule['default'] | undefined) => void
    ] = useState();
    const [demoSources, setDemoSources] = useState(['No source code for this demo...']);

    const isThemeDark: boolean = theme === Theme.dark;

    const sourceFilesToLoad: string[] = [`${demoName}.tsx`].concat(files);
    useEffect((): void => {
        _load(_loadDemoComponent, demoPath, demoName, setDemoComponent);

        const promises: Array<Promise<string>> = [];
        sourceFilesToLoad.forEach(
            (sourceFilename: string): void => {
                promises.push(_load(_loadSourceCode, demoPath, sourceFilename, noop));
            },
        );
        Promise.all(promises).then(
            (loadedSourceCodes: string[]): void => {
                setDemoSources(loadedSourceCodes);
            },
        );
    }, [demoPath, demoName]);

    return (
        <>
            <div className={classNames('main-block', className)}>
                {!isEmpty(title) && <h2 className="main-block__title">{title}</h2>}

                {!isEmpty(description) && <div className="main-block__description">{description}</div>}

                <div className="main-block__demo">
                    {demoComponent !== undefined && isFunction(demoComponent.view) && (
                        <div className={classNames('p', { 'lumx-theme-background-dark-N': isThemeDark })}>
                            {React.createElement(demoComponent.view, { theme }, null)}
                        </div>
                    )}

                    <div className="main-block__toolbar">
                        <div className="main-block__code-toggle">
                            <Button leftIcon={mdiCodeTags} emphasis={ButtonEmphasis.low} onClick={toggleDisplayCode}>
                                {shouldDisplayCode ? 'Hide code' : 'Show code'}
                            </Button>
                        </div>

                        <div className="main-block__theme-toggle">
                            <Switch position={SwitchPosition.right} label="Dark background" onToggle={setDarkTheme} />
                        </div>
                    </div>

                    {shouldDisplayCode && (
                        <div className="main-block__code">
                            {demoSources.map(
                                (demoSource: string, index: number): ReactElement => {
                                    return (
                                        <div
                                            key={sourceFilesToLoad[index]}
                                            className={classNames({ 'mt+': index > 0 })}
                                        >
                                            <code className="main-block__filename">{sourceFilesToLoad[index]}</code>

                                            <SyntaxHighlighter
                                                language="tsx"
                                                style={syntaxHighlighterStyle}
                                                customStyle={{ margin: 0 }}
                                                showLineNumbers={true}
                                            >
                                                {demoSource}
                                            </SyntaxHighlighter>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

/////////////////////////////

export { DemoBlock };
