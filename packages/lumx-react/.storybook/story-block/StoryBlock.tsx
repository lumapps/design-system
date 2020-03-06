import React, { ReactNode, useState } from 'react';

import classNames from 'classnames';

import { Chip, Size, Switch, SwitchPosition, Theme } from '@lumx/react';

import { styles } from './styles';
import { GlobalTheme, useInjectTheme } from './useInjectTheme';

export interface StoryBlockProps {
    children(p: { theme: Theme }): ReactNode;
}

export const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const [globalTheme, setGlobalTheme] = useState<GlobalTheme>('lumapps');
    const changeGlobalTheme = (newGlobalTheme: GlobalTheme) => () => setGlobalTheme(newGlobalTheme);

    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = () => setTheme(theme === Theme.light ? Theme.dark : Theme.light);

    const { children } = props;
    useInjectTheme(globalTheme);

    return (
        <div
            key="story"
            className={classNames(CLASSNAME, {
                'lumx-theme-background-dark-N lumx-theme-color-light-N': theme === Theme.dark,
            })}
            style={styles.block}
        >
            <div style={styles.selector}>
                <span className="lumx-typography-overline lumx-spacing-margin-tiny">Theme</span>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={globalTheme === 'lumapps'}
                    size={Size.s}
                    theme={theme}
                    onClick={changeGlobalTheme('lumapps')}
                >
                    LumApps
                </Chip>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={globalTheme === 'material'}
                    size={Size.s}
                    theme={theme}
                    onClick={changeGlobalTheme('material')}
                >
                    Material
                </Chip>
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
