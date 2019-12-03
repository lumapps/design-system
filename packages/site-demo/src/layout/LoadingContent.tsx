import React from 'react';

import { Progress } from '@lumx/react';

const LoadingContent = () => (
    <div className="main-content__loading">
        <Progress />
        Loading page...
    </div>
);

export { LoadingContent };
