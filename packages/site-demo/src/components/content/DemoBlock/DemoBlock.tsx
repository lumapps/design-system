import { CodeBlock } from '@lumx/demo/components/content/CodeBlock/CodeBlock';
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

import classNames from 'classnames';
import { useState } from 'react';

import './DemoBlock.scss';

interface DemoBlockProps extends FlexBoxProps {
    demo?: string;
    codeString?: string;
    theme?: Theme;
    withThemeSwitcher?: boolean;
    hasPlayButton?: boolean;
    backgroundColor?: { color: ColorPalette; variant: ColorVariant };
    alwaysShowCode?: boolean;
}

export const DemoBlock: React.FC<DemoBlockProps> = ({
    children,
    demo,
    codeString,
    theme: defaultTheme = Theme.light,
    withThemeSwitcher = false,
    hasPlayButton = false,
    backgroundColor: propBackgroundColor,
    alwaysShowCode,
    gap = Size.big,
    orientation = Orientation.vertical,
    ...flexBoxProps
}) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const toggleTheme = (isChecked: boolean) => {
        setTheme(isChecked ? Theme.dark : Theme.light);
    };

    const [showCode, setShowCode] = useState(!!alwaysShowCode);
    const toggleShowCode = () => setShowCode(!showCode);

    if (flexBoxProps.orientation === Orientation.horizontal) {
        // eslint-disable-next-line no-param-reassign
        flexBoxProps.hAlign = flexBoxProps.hAlign || Alignment.center;
        // eslint-disable-next-line no-param-reassign
        flexBoxProps.vAlign = flexBoxProps.vAlign || Alignment.center;
    }
    const backgroundColor = propBackgroundColor || (theme === Theme.dark ? { color: 'dark', variant: 'N' } : undefined);
    return (
        <div className={classNames('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <FlexBox
                className={classNames(
                    'demo-block__content',
                    backgroundColor && `lumx-color-background-${backgroundColor.color}-${backgroundColor.variant}`,
                )}
                wrap
                orientation={orientation}
                gap={gap}
                {...flexBoxProps}
            >
                {!children && (
                    <span>
                        Could not load demo <code>{demo}</code>.
                    </span>
                )}
                {typeof children === 'function' ? children({ theme }) : children}
            </FlexBox>
            {(!alwaysShowCode || withThemeSwitcher) && (
                <div className="demo-block__toolbar">
                    {!alwaysShowCode && (
                        <div className="demo-block__code-toggle">
                            <Button
                                disabled={!codeString}
                                emphasis={Emphasis.low}
                                leftIcon={mdiCodeTags}
                                onClick={toggleShowCode}
                            >
                                {showCode ? 'Hide code' : 'Show code'}
                            </Button>
                        </div>
                    )}

                    {withThemeSwitcher && (
                        <div className="demo-block__theme-toggle">
                            <Switch
                                disabled={!children}
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

            <CodeBlock
                className={classNames('demo-block__code', showCode && codeString && 'demo-block__code--shown')}
                codeString={codeString}
                language="tsx"
            />
        </div>
    );
};
