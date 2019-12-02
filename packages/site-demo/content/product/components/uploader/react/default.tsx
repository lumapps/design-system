import React from 'react';

import { mdiFileDocumentBoxPlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';

const App = ({ theme }) => <Uploader icon={mdiFileDocumentBoxPlus} label="Add files" theme={theme} />;

export default App;
