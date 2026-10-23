import { useState } from 'react';
import { mdiFolder, mdiFileDocument } from '@lumx/icons';
import { Icon, Text, TreeList } from '@lumx/react';

export default () => {
    const [value, setValue] = useState('report');
    return (
        <TreeList aria-label="Files" value={value} onChange={setValue}>
            <TreeList.Item label="Documents" before={<Icon icon={mdiFolder} size="xs" />}>
                <TreeList.Item
                    label="Report.pdf"
                    value="report"
                    description="Updated yesterday"
                    before={<Icon icon={mdiFileDocument} size="xs" />}
                />
                <TreeList.Item
                    label="Budget.xlsx"
                    value="budget"
                    description="Updated last week"
                    before={<Icon icon={mdiFileDocument} size="xs" />}
                    after={
                        <Text as="span" typography="caption" color="dark-L2">
                            Draft
                        </Text>
                    }
                />
            </TreeList.Item>
        </TreeList>
    );
};
