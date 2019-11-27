/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import '@lumx/core/lumx-theme-lumapps.scss';
import '@lumx/core/lumx-theme-material.scss';

import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import { styles } from './styles';

const CLASSNAME = 'story-block';
const StoryBlock = (props) => {
    const { children } = props;

    return (
        <div className={CLASSNAME} style={styles.block}>
            {children}
        </div>
    );
};

// eslint-disable-next-line react/no-multi-comp
const withStoryBlockDecorator = (storyFn) => <StoryBlock>{storyFn()}</StoryBlock>;

const decorators = [withA11y, withKnobs, withStoryBlockDecorator];

export { StoryBlock, decorators };
