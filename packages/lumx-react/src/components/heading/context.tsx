import { HeadingElement } from '@lumx/react/utils';
import { createContext } from 'react';

interface HeadingLevelContext {
    /** The current level */
    level: number;
    /** The heading element matching the current level */
    headingElement: HeadingElement;
}

const defaultContext: HeadingLevelContext = { level: 1, headingElement: 'h1' };

export const HeadingLevelContext = createContext<HeadingLevelContext>(defaultContext);
