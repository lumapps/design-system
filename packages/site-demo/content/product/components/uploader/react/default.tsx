import { mdiTextBoxPlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => <Uploader icon={mdiTextBoxPlus} label="Add files" theme={theme} />;
