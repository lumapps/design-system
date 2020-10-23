import { mdiFileDocumentBoxPlus } from '@lumx/icons';
import { Uploader } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => <Uploader icon={mdiFileDocumentBoxPlus} label="Add files" theme={theme} />;
