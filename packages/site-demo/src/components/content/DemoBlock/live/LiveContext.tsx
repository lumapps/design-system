import React from 'react';
import type { Theme } from '@lumx/react';

import type { Demo } from '../types';

export const LiveContext = React.createContext<null | { demo: Demo; theme: Theme }>(null);
