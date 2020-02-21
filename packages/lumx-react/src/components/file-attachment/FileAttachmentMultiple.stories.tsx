import { mdiFilePdfBox } from '@lumx/icons';
import React from 'react';
import { Theme } from '..';
import { FileAttachmentMultiple } from './FileAttachmentMultiple';

export default { title: 'File Attachment' };

export const multipleAttachmentFile = ({ theme }: { theme: Theme }) => (
    <FileAttachmentMultiple
        theme={theme}
        files={[
            {
                thumbnail: { image: 'https://loremflickr.com/320/240' },
                url: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
            {
                icon: { icon: mdiFilePdfBox },
                url: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
            {
                url: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
        ]}
    />
);
