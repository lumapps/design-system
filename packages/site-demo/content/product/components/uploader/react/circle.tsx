import React from 'react';

import { Uploader, UploaderVariant } from '@lumx/react';
import { mdiImagePlus } from '@lumx/icons';

const App = ({ theme }) => (
    <Uploader
        icon={mdiImagePlus}
        label="Add profile picture"
        theme={theme}
        variant={UploaderVariant.circle}
    />
);

export default App;
