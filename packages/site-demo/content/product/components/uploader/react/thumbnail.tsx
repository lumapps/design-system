import React from 'react';

import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant } from '@lumx/react';

const App = ({ theme }) => (
    <Uploader icon={mdiImagePlus} label="Add picture" theme={theme} variant={UploaderVariant.rounded} />
);

export default App;
