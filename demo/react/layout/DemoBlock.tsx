import React, { Fragment, useEffect, useState } from 'react';

import classNames from 'classnames';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tsx } from 'react-syntax-highlighter/dist/esm/languages/prism';
import { darcula as syntaxHighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

import { Button, ButtonEmphasises, ButtonThemes, Icon, Theme, Themes } from 'LumX';
import { IGenericProps } from 'LumX/core/react/utils';
import { mdiCodeTags, mdiCompare } from 'LumX/icons';

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
    children?: React.ReactNode;

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
    // tslint:disable-next-line: no-any
    default: { view(props: { [prop: string]: any }): JSX.Element };
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Load the demo component corresponding to the given demo name.
 *
 * @param  {string}             demoPath The path to the demo folder.
 * @param  {string}             demoName The name of the demo to load the component of.
 * @return {Promise<IESModule>} The promise of the load of the demo component.
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
 * @param  {string}             demoPath The path to the demo folder.
 * @param  {string}             file     The name of the demo to load the source code of.
 * @return {Promise<IESModule>} The promise of the load of the source code of the demo.
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
 * @param  {Function} load           The loading function to wrap.
 * @param  {string}   path           The path to the demo folder.
 * @param  {string}   file           The name of the file to load.
 * @param  {Function} setState       The set state function to use with the response of the load.
 * @param  {string}   [defaultValue] The default value to set when an error occurred.
 * @return {Promise} The promise of the load that will resolve with the loaded value (or the default one in case of
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
 * @return {React.ReactElement} The demo block component.
 */
const DemoBlock: React.FC<IProps> = ({
    blockTitle: title,
    children: description,
    className = '',
    demoName,
    demoPath,
    files = [],
}: IProps): React.ReactElement => {
    const [theme, setTheme]: [Theme, (theme: Theme) => void] = useState(Themes.light);
    const [shouldDisplayCode, setDisplayCode]: [boolean, (shouldDisplayCode: boolean) => void] = useState(false);
    const [demoComponent, setDemoComponent]: [
        IESModule['default'] | undefined,
        (demoComponent: IESModule['default'] | undefined) => void
    ] = useState();
    const [demoSources, setDemoSources]: [string[], (demoSources: string[]) => void] = useState([
        'No source code for this demo...',
    ]);

    /**
     * Switch between the light and dark theme.
     */
    const switchTheme: () => void = (): void => {
        setTheme(theme === Themes.light ? Themes.dark : Themes.light);
    };

    /**
     * Toggle the display of the code in the demo block.
     */
    const toggleDisplayCode: () => void = (): void => {
        setDisplayCode(!shouldDisplayCode);
    };

    const isThemeDark: boolean = theme === Themes.dark;

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
        <Fragment>
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
                            <Button emphasis={ButtonEmphasises.low} onClick={toggleDisplayCode}>
                                <Icon icon={mdiCodeTags} />
                                <span>{shouldDisplayCode ? 'Hide code' : 'Show code'}</span>
                            </Button>
                        </div>

                        <div className="main-block__theme-toggle">
                            <Button emphasis={ButtonEmphasises.low} onClick={switchTheme}>
                                <Icon icon={mdiCompare} />
                                <span>Switch to {theme === ButtonThemes.light ? 'dark' : 'light'} theme</span>
                            </Button>
                        </div>
                    </div>

                    {shouldDisplayCode && (
                        <div className="main-block__code">
                            {demoSources.map(
                                (demoSource: string, index: number): React.ReactNode => {
                                    return (
                                        <div className={classNames({ 'mt+': index > 0 })}>
                                            <code className="main-block__filename">{sourceFilesToLoad[index]}</code>

                                            <SyntaxHighlighter
                                                key={sourceFilesToLoad[index]}
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
        </Fragment>
    );
};

/////////////////////////////

export { DemoBlock };
