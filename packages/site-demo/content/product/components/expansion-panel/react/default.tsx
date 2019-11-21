import React, { useState } from 'react';

import { ExpansionPanel, Icon } from '@lumx/react';
import { mdiEmail } from '@lumx/icons';

const App = ({ theme }) => <>
    <ExpansionPanel theme={theme}>
        <header><Icon icon={mdiEmail} /> Header with icon</header>
        Content
    </ExpansionPanel>
</>

export default App;
