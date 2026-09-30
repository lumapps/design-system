import { useState } from 'react';
import { Icon, SelectList } from '@lumx/react';
import { mdiFileDocumentOutline, mdiFileImageOutline } from '@lumx/icons';

const FILES = [
    { id: 'report', name: 'Annual report.pdf', type: 'Documents', updated: 'Updated 2 days ago' },
    { id: 'budget', name: 'Budget 2026.xlsx', type: 'Documents', updated: 'Updated last week' },
    { id: 'logo', name: 'Logo.png', type: 'Images', updated: 'Updated yesterday' },
    { id: 'banner', name: 'Banner.jpg', type: 'Images', updated: 'Updated 3 weeks ago' },
];
type File = (typeof FILES)[number];

export default () => {
    const [value, onChange] = useState<File | undefined>();
    return (
        <SelectList
            aria-label="Files"
            options={FILES}
            getOptionId="id"
            getOptionName="name"
            getOptionDescription="updated"
            getSectionId="type"
            value={value}
            onChange={onChange}
            renderSectionTitle={(type, files) => `${type} (${files.length})`}
            renderOption={(file) => (
                <SelectList.Option
                    value={file.id}
                    before={
                        <Icon icon={file.type === 'Images' ? mdiFileImageOutline : mdiFileDocumentOutline} size="xs" />
                    }
                />
            )}
        />
    );
};
