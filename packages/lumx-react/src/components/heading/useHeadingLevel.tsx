import React from 'react';
import { HeadingLevelContext } from './context';

export const useHeadingLevel = () => {
    const { level = 1, headingElement = 'h1' } = React.useContext(HeadingLevelContext);

    return { level, headingElement };
};
