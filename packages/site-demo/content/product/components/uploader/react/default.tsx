import React from 'react';

import { mdiImagePlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';

const App = ({ theme }) => <Uploader icon={mdiImagePlus} label="Add profile picture" theme={theme} />;

export default App;
