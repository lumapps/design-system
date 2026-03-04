import { GridColumn } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <GridColumn itemMinWidth={64} maxColumns={4} gap="huge">
        <Placeholder name="1" height="auto" width="auto" />
        <Placeholder name="2" height="auto" width="auto" />
        <Placeholder name="3" height="auto" width="auto" />
        <Placeholder name="4" height="auto" width="auto" />
        <Placeholder name="5" height="auto" width="auto" />
        <Placeholder name="6" height="auto" width="auto" />
    </GridColumn>
);
