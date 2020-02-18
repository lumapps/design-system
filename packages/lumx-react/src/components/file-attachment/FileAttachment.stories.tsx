import { mdiFilePdfBox, mdiSend } from '@lumx/icons';
import { FileAttachment } from '@lumx/react';
import { files, text } from '@storybook/addon-knobs';
import React from 'react';
import { Size } from '..';
import { Avatar } from '../avatar/Avatar';
import { Icon } from '../icon/Icon';
import { List } from '../list/List';
import { ListDivider } from '../list/ListDivider';
import { ListItem } from '../list/ListItem';
import { Thumbnail, ThumbnailVariant } from '../thumbnail/Thumbnail';
import { FileAttachmentMultiple } from './FileAttachmentMultiple';

export default { title: 'File Attachment' };

export const simpleFileAttachment = () => (
    <FileAttachment
        fileTitle={text('File title', 'Presentation 2020')}
        fileDescription={text('File description', 'New presentation')}
        fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
    />
);

export const simpleFileAttachmentWithCustomIcon = () => (
    <FileAttachment
        fileTitle={text('File title', 'Presentation 2020')}
        fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
        fileDescription={text('File description', 'New presentation')}
        fileIcon={<Icon size={Size.l} icon={mdiFilePdfBox} />}
    />
);

export const simpleFileAttachmentWithImage = () => (
    <>
        <FileAttachment
            fileTitle={text('File title', 'Presentation 2020')}
            fileDescription={text('File description', 'New presentation')}
            fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
        />

        <div style={{ margin: 20 }} />

        <FileAttachment
            fileTitle={text('File title', 'Presentation 2020')}
            fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
            fileDescription={text('File description', 'New presentation')}
            fileIcon={<Icon size={Size.l} icon={mdiFilePdfBox} />}
        />

        <div style={{ margin: 20 }} />

        <FileAttachment
            fileTitle={text('File title', 'Presentation 2020')}
            fileUrl={text('File URL', 'https://cdn.com/api/pdf/presentation-2020.pdf')}
            fileDescription={text('File description', 'New presentation')}
            fileImage={files('File image', 'image/*', ['https://loremflickr.com/320/240'])[0]}
        />
        <div style={{ margin: 20 }} />

        <FileAttachmentMultiple
            files={[
                {
                    fileImage: 'https://loremflickr.com/320/240',
                    fileUrl: 'https:// cdn.com/api/pdf/presentation-2020.pdf',
                },
                {
                    fileIcon: <Icon size={Size.m} icon={mdiFilePdfBox} />,
                    fileUrl: 'https:// cdn.com/api/pdf/presentation-2020.pdf',
                },
                {
                    fileUrl: 'https:// cdn.com/api/pdf/presentation-2020.pdf',
                },
            ]}
        />
        <div style={{ margin: 20 }} />

        <List isClickable style={{ backgroundColor: 'rgba(40, 51, 109, 0.05)' }}>
            <ListItem before={<Icon icon={mdiSend} size={Size.xs} />}>Single-line item</ListItem>
            <ListDivider
                style={{
                    margin: '0px 16px',
                    marginLeft: '68px',
                }}
            />
            <ListItem
                before={<Thumbnail variant={ThumbnailVariant.rounded} image="https://picsum.photos/72" size={Size.m} />}
            >
                Single-line item
            </ListItem>
            <ListDivider
                style={{
                    margin: '0px 16px',
                    marginLeft: '68px',
                }}
            />
            <ListItem before={<Avatar image="http://i.pravatar.cc/72" size={Size.m} />}>Single-line item</ListItem>
        </List>
    </>
);
