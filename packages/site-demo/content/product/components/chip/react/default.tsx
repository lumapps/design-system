import React from 'react';

import { Chip, Icon, Size } from '@lumx/react';
import { mdiEmail } from '@lumx/icons';

const App = ({ theme }) => (
    <>
        <Chip theme={theme}>Default</Chip>
        <Chip before={<Icon icon={mdiEmail} size={Size.xs} />} theme={theme}>
            Rich
        </Chip>
    </>
);

export default App;
