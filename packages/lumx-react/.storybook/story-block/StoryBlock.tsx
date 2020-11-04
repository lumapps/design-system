import React, { ReactNode, useState } from 'react';

import classNames from 'classnames';

import { Switch, SwitchPosition, Theme } from '@lumx/react';

import { styles } from './styles';

interface StoryBlockProps {
    children(p: { theme: Theme }): ReactNode;
}

const CLASSNAME = 'story-block';

const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = () => setTheme(theme === Theme.light ? Theme.dark : Theme.light);

    const { children } = props;

    return (
        <div
            key="story"
            className={classNames(CLASSNAME, {
                'lumx-color-background-dark-N lumx-color-font-light-N': theme === Theme.dark,
            })}
            style={styles.block}
        >
            <div style={styles.selector}>
                <Switch
                    checked={theme === Theme.dark}
                    onToggle={toggleTheme}
                    position={SwitchPosition.right}
                    theme={theme}
                >
                    <span className="lumx-typography-overline lumx-spacing-margin-tiny">Dark Background</span>
                </Switch>
            </div>

            {children({ theme })}
        </div>
    );
};

export { StoryBlock };
