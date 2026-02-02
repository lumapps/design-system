import { inject } from 'vue';
import { defaultContext, HeadingLevelContext } from '@lumx/core/js/components/Heading/constants';
import { HeadingLevelContextKey } from './context';

/**
 * Hook to get the current heading level from the context.
 *
 * @return The current heading level and element.
 */
export const useHeadingLevel = (): HeadingLevelContext => {
    return inject(HeadingLevelContextKey, defaultContext);
};
