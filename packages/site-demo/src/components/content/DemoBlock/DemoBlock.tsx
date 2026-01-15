import { mdiCodeTags } from '@lumx/icons';
import {
    Alignment,
    Button,
    ColorPalette,
    ColorVariant,
    Emphasis,
    FlexBox,
    FlexBoxProps,
    Orientation,
    Size,
    Switch,
    Theme,
} from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';
import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LivePreview } from './live';
import { Demo } from './types';

import './DemoBlock.scss';

interface DemoBlockProps extends FlexBoxProps {
    demo: Demo;
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
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [showCode, setShowCode] = useState(!!alwaysShowCode);

    const toggleTheme = (isChecked: boolean) => {
        setTheme(isChecked ? Theme.dark : Theme.light);
    };

    const toggleShowCode = () => setShowCode(!showCode);

    const flexBoxProps = { ...forwardedProps };
    if (flexBoxProps.orientation === Orientation.horizontal) {
        flexBoxProps.hAlign = flexBoxProps.hAlign || Alignment.center;
        flexBoxProps.vAlign = flexBoxProps.vAlign || Alignment.center;
    }

    return (
        <div className={classNames.join('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <LiveProvider demo={demo} theme={theme}>
                <FlexBox
                    className={classNames.join(
                        'demo-block__content',
                        theme === Theme.dark && classNames.background('dark'),
                    )}
                    wrap
                    orientation={orientation}
                    gap={gap}
                    {...flexBoxProps}
                >
                    <LivePreview />
                </FlexBox>

                {(!alwaysShowCode || withThemeSwitcher) && (
                    <div className="demo-block__toolbar">
                        {!alwaysShowCode && (
                            <div className="demo-block__code-toggle">
                                <Button emphasis={Emphasis.low} leftIcon={mdiCodeTags} onClick={toggleShowCode}>
                                    {showCode ? 'Hide code' : 'Show code'}
                                </Button>
                            </div>
                        )}

                        {withThemeSwitcher && (
                            <div className="demo-block__theme-toggle">
                                <Switch
                                    position={Alignment.right}
                                    isChecked={theme === Theme.dark}
                                    onChange={toggleTheme}
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
