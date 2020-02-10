import React from 'react';

import { Progress, ProgressVariant } from '@lumx/react';

const App = ({ theme }: any) => (
    <>
        <Progress theme={theme} variant={ProgressVariant.linear} />
    </>
);

export default App;
