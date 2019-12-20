/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';

import classnames from 'classnames';

/**
 * Please make sure that these themes are in the same order
 * as the `THEMES` constant.
 */
import '@lumx/core/scss/lumx-theme-material.scss';
import '@lumx/core/scss/lumx-theme-lumapps.scss';

import { Chip, Size, Switch, SwitchPosition, Theme } from '@lumx/react';

import { styles } from './styles';

const THEMES = ['material', 'lumapps'];

const stylesNodes = [];

const CLASSNAME = 'story-block';
const StoryBlock = (props) => {
    const [theme, setTheme] = useState('lumapps');
    const [colorTheme, setColorTheme] = useState(Theme.light);

    const { children } = props;

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const toggleTheme = (checked) => {
        if (checked) {
            setColorTheme(Theme.dark);
        } else {
            setColorTheme(Theme.light);
        }
    };

    useEffect(() => {
        /**
         * This effect retrieves all the injected styles that were added
         * by storybook, and only adds the ones associated to the current theme.
         *
         * Upon clicking the theme selector chips, we can update the theme
         * currently used, and execute this effect once again to determine which
         * theme we want to use.
         *
         * In the first execution, we cache the styles that were added, in order to
         * use them later on once the theme changing starts.
         */
        const currentStyle = THEMES.indexOf(theme);
        const nodes = document.querySelectorAll('style#injected-styles');

        if (stylesNodes.length === 0) {
            /**
             * In the first execution, we cache the styles that were added, in order to
             * use them later on once the theme changing starts.
             *
             * We also take the opportunity to remove all the other styles that are not needed.
             */
            nodes.forEach((node, position) => {
                stylesNodes.push(node.cloneNode(true));

                if (position !== currentStyle) {
                    node.remove();
                }
            });
        } else {
            /**
             * In this step, we have already remove the initial unnecesary styles,
             * we just need to add the selected theme. We remove all the current styles
             * and only add the stylesheet needed from the cached list.
             */
            nodes.forEach((node) => {
                node.remove();
            });

            document.head.appendChild(stylesNodes[currentStyle]);
        }
    });

    return [
        <div
            key="story"
            className={classnames(CLASSNAME, {
                'lumx-theme-background-dark-N lumx-theme-color-light-N': colorTheme === Theme.dark,
            })}
            style={styles.block}
        >
            <div className={`${CLASSNAME}__theme-selector`} style={styles.selector}>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={theme === 'lumapps'}
                    size={Size.s}
                    theme={colorTheme}
                    onClick={() => changeTheme('lumapps')}
                >
                    LumApps
                </Chip>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={theme === 'material'}
                    size={Size.s}
                    theme={colorTheme}
                    onClick={() => changeTheme('material')}
                >
                    Material
                </Chip>
            </div>

            {children({ theme: colorTheme })}
        </div>,
        <div key="switcher" className={`${CLASSNAME}__color-theme-selector`} style={styles.colorThemeSelector}>
            <Switch checked={colorTheme === Theme.dark} position={SwitchPosition.right} onToggle={toggleTheme}>
                Dark Background
            </Switch>
        </div>,
    ];
};

export { StoryBlock };
