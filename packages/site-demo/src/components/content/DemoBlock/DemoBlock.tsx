import { CodeBlock } from '@lumx/demo/components/content/CodeBlock/CodeBlock';
import { mdiCodeTags } from '@lumx/icons';
import { Alignment, Button, Emphasis, FlexBox, FlexBoxProps, Orientation, Size, Switch, Theme } from '@lumx/react';

import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import React, { useState } from 'react';

import './DemoBlock.scss';

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
    const [theme, setTheme] = useState<Theme>(Theme.light);
    const toggleTheme = (isChecked: boolean) => {
        setTheme(isChecked ? Theme.dark : Theme.light);
    };

    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = () => setShowCode(!showCode);

    if (flexBoxProps.orientation === Orientation.horizontal) {
        // eslint-disable-next-line no-param-reassign
        flexBoxProps.hAlign = flexBoxProps.hAlign || Alignment.center;
        // eslint-disable-next-line no-param-reassign
        flexBoxProps.vAlign = flexBoxProps.vAlign || Alignment.center;
    }
    return (
        <div className={classNames('demo-block', { 'demo-block--has-play-button': hasPlayButton })}>
            <FlexBox
                className={classNames('demo-block__content', theme === Theme.dark && 'lumx-color-background-dark-N')}
                wrap
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
                            position={Alignment.right}
                            isChecked={theme === Theme.dark}
                            onChange={toggleTheme}
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
