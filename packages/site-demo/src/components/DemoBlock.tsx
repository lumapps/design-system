import { CodeBlock } from '@lumx/demo/components/CodeBlock';
import { mdiCodeTags } from '@lumx/icons';
import {
    Alignment,
    Button,
    Emphasis,
    FlexBox,
    FlexBoxProps,
    Orientation,
    Size,
    Switch,
    SwitchPosition,
    Theme,
} from '@lumx/react';

import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import React, { useState } from 'react';

interface DemoBlockProps extends FlexBoxProps {
    demo?: string;
    codeString?: string;
    withThemeSwitcher?: boolean;
    hasPlayButton?: boolean;
}

const DEFAULT_PROPS: Partial<DemoBlockProps> = {
    gap: Size.big,
    orientation: Orientation.vertical,
};

export const DemoBlock: React.FC<DemoBlockProps> = ({
    children,
    demo,
    codeString,
    withThemeSwitcher = false,
    hasPlayButton = false,
    ...flexBoxProps
}) => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = (checked: boolean) => (checked ? setTheme(Theme.dark) : setTheme(Theme.light));

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = () => setShowCode(!showCode);

    if (flexBoxProps.orientation === Orientation.horizontal) {
        flexBoxProps.hAlign = flexBoxProps.hAlign || Alignment.center;
        flexBoxProps.vAlign = flexBoxProps.vAlign || Alignment.center;
    }
    return (
        <div className={classNames('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <FlexBox
                className={classNames('demo-block__content', theme === Theme.dark && 'lumx-color-background-dark-N')}
                {...flexBoxProps}
            >
                {!children && (
                    <span>
                        Could not load demo <code>{demo}</code>.
                    </span>
                )}
                {isFunction(children) ? children({ theme }) : children}
            </FlexBox>
            <div className="demo-block__toolbar">
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

                {withThemeSwitcher && (
                    <div className="demo-block__theme-toggle">
                        <Switch
                            disabled={!children}
                            position={SwitchPosition.right}
                            checked={theme === Theme.dark}
                            onToggle={toggleTheme}
                        >
                            Dark Background
                        </Switch>
                    </div>
                )}
            </div>

            {showCode && codeString && (
                <CodeBlock className="demo-block__code" codeString={codeString} language="tsx" />
            )}
        </div>
    );
};
DemoBlock.defaultProps = DEFAULT_PROPS;
