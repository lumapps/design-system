import { useMemo } from 'react';

import uniqueId from 'lodash/uniqueId';

/**
 * Generate a unique and stable id that can then safely be used as html id.
 * This is similar to, but much simpler than, React's `useId` hook.
 *
 * Once we upgrade to React 18, this hook will be deprecated.
 */
export const useId = (prefix: string = 'lumx') => {
    // A common practice to make sure ids are unique is to surround them with colons.
    return useMemo(() => `:${uniqueId(prefix)}:`, [prefix]);
};
