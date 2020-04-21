import React from 'react';

import { Select } from '@lumx/react';

const App = ({ theme }: any) => {
    return <Select hasError value="" label="Select label" placeholder="Select a value" theme={theme} />;
};

export default App;
