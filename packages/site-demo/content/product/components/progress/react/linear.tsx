import { Progress, ProgressVariant } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <>
        <Progress theme={theme} variant={ProgressVariant.linear}/>
    </>
);

export default App;
