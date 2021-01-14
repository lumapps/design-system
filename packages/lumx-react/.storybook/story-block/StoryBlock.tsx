import { Switch, Alignment, Theme } from '@lumx/react';
import isChromatic from 'chromatic/isChromatic';
import React, { ReactElement, useState } from 'react';
import '@lumx/core/scss/lumx.scss';
import '@lumx/core/css/material.css';
import classNames from 'classnames';
import { styles } from './styles';

import 'focus-visible';

interface StoryBlockProps {
    children(p: { theme: Theme, today?: Date }): ReactElement;
}

const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const { children } = props;

    const [theme, setTheme] = useState<Theme>(Theme.light);
    const toggleTheme = () => setTheme(theme === Theme.light ? Theme.dark : Theme.light);

    if (isChromatic()) {
        // Hard code today date for chromatic.
        return children({ theme, today: new Date('May 25 2021 01:00') });
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
                <Switch
                    isChecked={theme === Theme.dark}
                    onChange={toggleTheme}
                    position={Alignment.right}
                    theme={theme}
                >
                    <span className="lumx-typography-overline lumx-spacing-margin-tiny">Dark Background</span>
                </Switch>
            </div>

            {children({ theme })}
        </div>
    );
};
