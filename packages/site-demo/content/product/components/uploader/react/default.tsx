import React from 'react';

import { Uploader } from '@lumx/react';
import { mdiImagePlus } from '@lumx/icons';

const App = ({ theme }) => (
    <Uploader
        icon={mdiImagePlus}
        label="Add profile picture"
        theme={theme}
    />
);

export default App;
