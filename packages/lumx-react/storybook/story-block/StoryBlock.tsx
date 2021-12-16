import React, { ElementType, useState } from 'react';
import classNames from 'classnames';
import isChromatic from 'chromatic/isChromatic';
import { Alignment, Switch, Theme } from '@lumx/react';
import { MaterialThemeSwitcher } from '@lumx/react/utils/MaterialThemeSwitcher';

import '@lumx/core/scss/lumx.scss';
import './index.scss';

import 'focus-visible';

interface StoryBlockProps {
    Story: ElementType;
    context: any;
}

const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const { Story, context } = props;

    const [theme, setTheme] = useState<Theme>(Theme.light);
    context.args.theme = theme;
    const toggleTheme = () => setTheme(theme === Theme.light ? Theme.dark : Theme.light);

    // Hard code today date for chromatic.
    context.args.today = isChromatic() ? new Date('May 25 2021 01:00') : new Date();

    if (isChromatic()) return <Story />;

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

            <Story />
        </div>
    );
};
