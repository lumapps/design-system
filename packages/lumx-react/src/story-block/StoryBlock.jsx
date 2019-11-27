/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';

import '@lumx/core/lumx-theme-lumapps.scss';
import '@lumx/core/lumx-theme-material.scss';

import { Chip, Size } from '@lumx/react';

import { styles } from './styles';

const CLASSNAME = 'story-block';
const StoryBlock = (props) => {
    const [theme, setTheme] = useState('lumapps');
    const { children } = props;

    return (
        <div className={CLASSNAME} style={styles.block}>
            <div className={`${CLASSNAME}__theme-selector`}>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={theme === 'lumapps'}
                    size={Size.s}
                    onClick={() => setTheme('lumapps')}
                >
                    LumApps
                </Chip>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    isSelected={theme === 'material'}
                    size={Size.s}
                    onClick={() => setTheme('material')}
                >
                    Material
                </Chip>
            </div>
            {children}
        </div>
    );
};

export { StoryBlock };
