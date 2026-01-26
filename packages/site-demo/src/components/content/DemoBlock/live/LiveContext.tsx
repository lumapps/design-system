import { createContext, useContext } from 'react';
import { FlexBoxProps, Theme } from '@lumx/react';

import type { Demos } from '../types';

export interface LiveContextType {
    demo: Demos;
    theme: Theme;
    isEditMode: boolean;
    flexBoxProps?: FlexBoxProps;
}

export const LiveContext = createContext<LiveContextType | undefined>(undefined);

export const useLiveContext = () => {
    const context = useContext(LiveContext);
    if (!context) {
        throw new Error('useLiveContext must be used within a LiveProvider');
    }
    return context;
};
