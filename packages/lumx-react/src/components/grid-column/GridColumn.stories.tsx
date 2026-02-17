import { GridColumn } from '@lumx/react/components/grid-column/GridColumn';
import { setup } from '@lumx/core/js/components/GridColumn/GridColumnStories';

const { meta, ...stories } = setup({
    component: GridColumn,
});

export default {
    title: 'LumX components/grid-column/GridColumn',
    ...meta,
};

export const Default = { ...stories.Default };
export const Columns = { ...stories.Columns };
