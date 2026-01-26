import React, { useState } from 'react';

import { mdiCodeTags, mdiPlay, mdiRefresh } from '@lumx/icons';
import { Button, ColorPalette, ColorVariant, FlexBoxProps, Orientation, Size, Switch, Theme } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

import { LiveProvider, LiveEditor, LivePreview, loadSandpack } from './live';
import { Demos } from './types';
import { useFramework } from '../../layout/FrameworkContext';

import './DemoBlock.scss';

interface DemoBlockProps extends FlexBoxProps {
    demo: Demos;
    theme?: Theme;
    withThemeSwitcher?: boolean;
    hasPlayButton?: boolean;
    backgroundColor?: { color: ColorPalette; variant: ColorVariant };
    alwaysShowCode?: boolean;
}

export const DemoBlock: React.FC<DemoBlockProps> = ({
    demo,
    theme: defaultTheme = Theme.light,
    withThemeSwitcher = false,
    hasPlayButton = false,
    backgroundColor: propBackgroundColor,
    alwaysShowCode,
    gap = Size.big,
    orientation = Orientation.vertical,
    ...forwardedProps
}) => {
    const [currentTheme, setTheme] = useState<Theme>(defaultTheme);
    const [showCode, setShowCode] = useState(!!alwaysShowCode);
    const [isEditMode, setIsEditMode] = useState(false);
    const theme = isEditMode ? Theme.light : currentTheme;

    const toggleTheme = (isChecked: boolean) => {
        setTheme(isChecked ? Theme.dark : Theme.light);
    };
    const toggleShowCode = () => setShowCode(!showCode);
    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const flexBoxProps: FlexBoxProps = { gap, orientation, wrap: true, ...forwardedProps };
    const { framework } = useFramework();
    const currentDemo = demo[framework];
    const sourceCode = currentDemo?.sourceCode?.trim();

    return (
        <div className={classNames.join('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <LiveProvider demo={demo} theme={theme} isEditMode={isEditMode} flexBoxProps={flexBoxProps}>
                <LivePreview
                    className={classNames.join(
                        'demo-block__content',
                        theme === Theme.dark && classNames.background('dark'),
                    )}
                />

                {(!alwaysShowCode || withThemeSwitcher) && (
                    <div className="demo-block__toolbar">
                        {!alwaysShowCode && (
                            <div className="demo-block__code-toggle">
                                <Button emphasis="low" leftIcon={mdiCodeTags} onClick={toggleShowCode}>
                                    {showCode ? 'Hide code' : 'Show code'}
                                </Button>
                                {sourceCode && (
                                    <Button
                                        emphasis="low"
                                        leftIcon={isEditMode ? mdiRefresh : mdiPlay}
                                        onClick={toggleEditMode}
                                        onMouseEnter={loadSandpack}
                                        onFocus={loadSandpack}
                                    >
                                        {isEditMode ? 'Reset' : 'Live version'}
                                    </Button>
                                )}
                            </div>
                        )}

                        {withThemeSwitcher && (
                            <div className="demo-block__theme-toggle">
                                <Switch
                                    position="right"
                                    isChecked={theme === Theme.dark}
                                    onChange={toggleTheme}
                                    isDisabled={isEditMode}
                                >
                                    Dark theme
                                </Switch>
                            </div>
                        )}
                    </div>
                )}

                {showCode && (
                    <div className="demo-block__code demo-block__code--shown">
                        <LiveEditor />
                    </div>
                )}
            </LiveProvider>
        </div>
    );
};
