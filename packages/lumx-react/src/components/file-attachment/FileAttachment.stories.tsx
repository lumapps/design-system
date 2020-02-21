import { mdiFilePdfBox } from '@lumx/icons';
import { FileAttachment } from '@lumx/react';
import { files, text } from '@storybook/addon-knobs';
import React from 'react';
import { Theme } from '..';

export default { title: 'File Attachment' };

export const simpleFileAttachment = ({ theme }: { theme: Theme }) => (
    <FileAttachment
        theme={theme}
        title={text('File title', 'Presentation 2020')}
        description={text('File description', 'New presentation')}
        url={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
    />
);

export const simpleFileAttachmentWithCustomIcon = ({ theme }: { theme: Theme }) => (
    <FileAttachment
        theme={theme}
        title={text('File title', 'Presentation 2020')}
        url={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
        description={text('File description', 'New presentation')}
        fileIcon={{ icon: mdiFilePdfBox }}
    />
);

export const simpleFileAttachmentWithImage = ({ theme }: { theme: Theme }) => (
    <FileAttachment
        theme={theme}
        title={text('File title', 'Presentation 2020')}
        url={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
        description={text('File description', 'New presentation')}
        thumbnail={{ image: files('File image', 'image/*', ['https://loremflickr.com/320/240'])[0] }}
    />
);
