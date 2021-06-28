import React from 'react';

import { StoryBlock } from './StoryBlock';

export const withStoryBlockDecorator = (storyFn) => <StoryBlock>{storyFn}</StoryBlock>;
