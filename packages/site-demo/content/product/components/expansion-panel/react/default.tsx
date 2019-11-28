import React, { useState } from 'react';

import { ExpansionPanel, Icon } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <ExpansionPanel label="Lorem ipsum" theme={theme} />
    </>
);

export default App;
