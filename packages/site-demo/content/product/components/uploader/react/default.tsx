import React from 'react';

import { mdiTextBoxPlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Uploader icon={mdiTextBoxPlus} label="Add files" theme={theme} />
    </div>
);

export default App;
