import { Switch, Alignment, Theme } from '@lumx/react';
import isChromatic from 'chromatic/isChromatic';
import React, { ReactElement, useState } from 'react';
import '@lumx/core/scss/lumx.scss';
import classNames from 'classnames';
import { styles } from './styles';

import 'focus-visible';

interface StoryBlockProps {
    children(p: { theme: Theme }): ReactElement;
}

const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const { children } = props;

    const [theme, setTheme] = useState<Theme>(Theme.light);
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
