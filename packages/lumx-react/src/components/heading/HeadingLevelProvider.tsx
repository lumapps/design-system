import { HeadingElement } from '@lumx/react/utils/type';
import { ReactNode } from 'react';
import { MAX_HEADING_LEVEL } from './constants';
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

    const incrementedLevel = level || contextLevel + 1;
    /** Don't allow a level beyond the maximum level. */
    const nextLevel = incrementedLevel > MAX_HEADING_LEVEL ? MAX_HEADING_LEVEL : incrementedLevel;
    const headingElement = `h${nextLevel}` as HeadingElement;

    return (
        <HeadingLevelContext.Provider value={{ level: nextLevel, headingElement }}>
            {children}
        </HeadingLevelContext.Provider>
    );
};
