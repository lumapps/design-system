import React from 'react';

import { TextField } from '@lumx/react';
import { noop } from 'lodash';

const App = ({ theme }: any) => {
    return <TextField label="Textfield label" isDisabled theme={theme} onChange={noop} value="" />;
};

export default App;
