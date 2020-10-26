import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <Uploader icon={mdiImagePlus} label="Add photo" theme={theme} variant={UploaderVariant.circle} />
);
