import React from 'react';
import { StoryBlock } from './StoryBlock';

export const withStoryBlockDecorator = (Story, context) => {
    return <StoryBlock Story={Story} context={context}/>;
};
