import { setup } from '@lumx/core/js/components/Table/Stories';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '.';

const { meta, ...stories } = setup({
    component: Table,
    components: { TableBody, TableCell, TableHeader, TableRow },
});

export default {
    title: 'LumX components/table/Table',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithHeader = { ...stories.WithHeader };
