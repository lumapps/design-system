/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import { StoryBlock } from './StoryBlock';

const withStoryBlockDecorator = (storyFn) => <StoryBlock>{({ theme }) => storyFn({ theme })}</StoryBlock>;

const decorators = [withA11y, withKnobs, withStoryBlockDecorator];

export { decorators };
