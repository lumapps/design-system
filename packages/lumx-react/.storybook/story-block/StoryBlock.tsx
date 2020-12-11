import { GlobalTheme } from '@lumx/core/js/types';
import { Chip, Size, Switch, SwitchPosition, Theme } from '@lumx/react';
import isChromatic from 'chromatic/isChromatic';
import React, { ReactElement, useState } from 'react';

import classNames from 'classnames';
import { styles } from './styles';
import { useInjectTheme } from './useInjectTheme';

import 'focus-visible';

interface StoryBlockProps {
    children(p: { theme: Theme }): ReactElement;
}

const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const { children } = props;

    const [globalTheme, setGlobalTheme] = useState<GlobalTheme>('lumapps');
    const changeGlobalTheme = (newGlobalTheme: GlobalTheme) => () => setGlobalTheme(newGlobalTheme);
    useInjectTheme(globalTheme);

    const [theme, setTheme] = useState(Theme.light);
    const toggleTheme = () => setTheme(theme === Theme.light ? Theme.dark : Theme.light);

    if (isChromatic()) {
        return children({ theme });
    }

    return (
        <div
            className={classNames(
                CLASSNAME,
                theme === Theme.dark && 'lumx-color-background-dark-N lumx-color-font-light-N',
            )}
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
                    isChecked={theme === Theme.dark}
                    onChange={toggleTheme}
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
