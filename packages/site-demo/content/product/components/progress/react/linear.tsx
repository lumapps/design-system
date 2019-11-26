import React from 'react';

import { Progress, ProgressVariant } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Progress theme={theme} variant={ProgressVariant.linear} />
    </>
);

export default App;
