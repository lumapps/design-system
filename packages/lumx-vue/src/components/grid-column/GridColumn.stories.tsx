import range from 'lodash/range';
import { GridColumn } from '@lumx/vue';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { setup } from '@lumx/core/js/components/GridColumn/GridColumnStories';

const genericBlockStyle = { border: '1px solid red', padding: '2px 8px' };

const getItems = (nb: number) =>
    range(nb).map((key) => (
        <div key={key} style={genericBlockStyle}>
            <h2>Column {key}</h2>
            <p>{loremIpsum('tiny')}</p>
        </div>
    ));

const { meta, ...stories } = setup({
    component: GridColumn,
    render: ({ nbItems = 5, ...props }: any) => <GridColumn {...props}>{getItems(nbItems)}</GridColumn>,
});

export default {
    title: 'LumX components/grid/GridColumn',
    ...meta,
};

export const Default = { ...stories.Default };
export const Columns = { ...stories.Columns };
