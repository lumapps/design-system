import React from 'react';

import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant } from '@lumx/react';

const App = ({ theme }) => (
    <div className="demo-grid">
        <Uploader icon={mdiImagePlus} label="Add photo" theme={theme} variant={UploaderVariant.circle} />
    </div>
);

export default App;
