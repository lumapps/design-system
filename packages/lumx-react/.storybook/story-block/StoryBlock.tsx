import React, { ReactElement, useState } from 'react';
import classNames from 'classnames';
import isChromatic from 'chromatic/isChromatic';
import { Alignment, Switch, Theme } from '@lumx/react';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';

import '@lumx/core/scss/lumx.scss';
import './index.scss';

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
        <div className={classNames(CLASSNAME, `${CLASSNAME}--theme-${theme}`)}>
            <div className={`${CLASSNAME}__toolbar`}>
                <Switch
                    className="dark-theme-switcher"
                    isChecked={theme === Theme.dark}
                    onChange={toggleTheme}
                    position={Alignment.right}
                    theme={theme}
                >
                    Dark Background
                </Switch>
                <MaterialThemeSwitcher theme={theme} />
            </div>

            {children({ theme })}
        </div>
    );
};
