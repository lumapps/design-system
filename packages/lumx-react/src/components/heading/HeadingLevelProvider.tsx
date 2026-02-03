import { ReactNode } from 'react';

import { HeadingElement } from '@lumx/react/utils/type';

import { computeHeadingLevel } from '@lumx/core/js/components/Heading/utils';

import { HeadingLevelContext } from './context';
import { useHeadingLevel } from './useHeadingLevel';

export interface HeadingLevelProviderProps {
    /** The heading level to start at. If left undefined, the parent context will be used, if any. */
    level?: number;
    /** The children to display */
    children: ReactNode;
}

/**
 * Provide a new heading level context.
 */
export const HeadingLevelProvider: React.FC<HeadingLevelProviderProps> = ({ children, level }) => {
    const { level: contextLevel } = useHeadingLevel();

    const nextLevel = computeHeadingLevel(level, contextLevel);
    const headingElement = `h${nextLevel}` as HeadingElement;

    return (
        <HeadingLevelContext.Provider value={{ level: nextLevel, headingElement }}>
            {children}
        </HeadingLevelContext.Provider>
    );
};
