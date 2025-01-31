import React from 'react';
import { ErrorBoundary } from '@lumx/demo/components/base/ErrorBoundary';

import './MainContent.scss';

export const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="main-content">
        <div className="main-content__wrapper">
            <ErrorBoundary>{children}</ErrorBoundary>
        </div>
    </div>
);
