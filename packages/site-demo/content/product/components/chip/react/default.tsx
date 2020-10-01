import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Chip theme={theme}>Default</Chip>

        <Chip before={<Icon icon={mdiEmail} size={Size.xs} />} theme={theme}>
            Default rich
        </Chip>
    </div>
);

export default App;
