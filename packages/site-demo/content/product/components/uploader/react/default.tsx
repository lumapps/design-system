import React from 'react';

import { mdiFileDocumentBoxPlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Uploader icon={mdiFileDocumentBoxPlus} label="Add files" theme={theme} />
    </div>
);

export default App;
