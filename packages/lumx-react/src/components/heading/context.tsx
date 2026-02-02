import { createContext } from 'react';

import {
    type HeadingLevelContext as HeadingLevelContextType,
    defaultContext,
} from '@lumx/core/js/components/Heading/constants';

export const HeadingLevelContext = createContext<HeadingLevelContextType>(defaultContext);
