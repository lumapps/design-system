import { createContext } from 'react';

import { Orientation } from '@lumx/core/js/constants';

export const NavigationContext = createContext<{ orientation?: Orientation } | undefined>({
    orientation: Orientation.vertical,
});
