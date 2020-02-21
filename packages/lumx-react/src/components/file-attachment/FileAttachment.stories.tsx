import { mdiFilePdfBox } from '@lumx/icons';
import { FileAttachment } from '@lumx/react';
import { files, text } from '@storybook/addon-knobs';
import React from 'react';
import { Theme } from '..';
import { Thumbnail } from '../thumbnail/Thumbnail';

export default { title: 'File Attachment' };

export const simpleFileAttachment = ({ theme }: { theme: Theme }) => (
    <FileAttachment
        theme={theme}
        fileTitle={text('File title', 'Presentation 2020')}
        fileDescription={text('File description', 'New presentation')}
        fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
    />
);

export const simpleFileAttachmentWithCustomIcon = ({ theme }: { theme: Theme }) => (
    <FileAttachment
        theme={theme}
        fileTitle={text('File title', 'Presentation 2020')}
        fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
        fileDescription={text('File description', 'New presentation')}
        fileIcon={{ icon: mdiFilePdfBox }}
    />
);

export const simpleFileAttachmentWithImage = ({ theme }: { theme: Theme }) => (
    <>
        <FileAttachment
            theme={theme}
            fileTitle={text('File title', 'Presentation 2020')}
            fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
            fileDescription={text('File description', 'New presentation')}
            fileThumbnail={{ image: files('File image', 'image/*', ['https://loremflickr.com/320/240'])[0] }}
        />
    </>
);

export const pouet = ({ theme }: { theme: Theme }) => (
    <>
        <Thumbnail image={mdiFilePdfBox} />
    </>
);
