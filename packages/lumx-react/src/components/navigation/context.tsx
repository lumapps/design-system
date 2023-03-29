import { createContext } from 'react';
import { Orientation } from '..';

export const NavigationContext = createContext<{ orientation?: Orientation } | undefined>({
    orientation: Orientation.vertical,
});
