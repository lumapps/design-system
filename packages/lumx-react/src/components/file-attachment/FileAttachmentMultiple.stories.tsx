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
                fileThumbnail: { image: 'https://loremflickr.com/320/240' },
                fileUrl: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
            {
                fileIcon: { icon: mdiFilePdfBox },
                fileUrl: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
            {
                fileUrl: 'https://cdn.com/api/pdf/presentation-2020.pdf',
            },
        ]}
    />
);
