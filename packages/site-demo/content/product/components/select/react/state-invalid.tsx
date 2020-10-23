import { Select } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <Select hasError value="" label="Select label" placeholder="Select a value" theme={theme}/>
);

export default App;
