import React from 'react';

import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant } from '@lumx/react';

const App = ({ theme }) => (
    <Uploader icon={mdiImagePlus} label="Add profile picture" theme={theme} variant={UploaderVariant.circle} />
);

export default App;
