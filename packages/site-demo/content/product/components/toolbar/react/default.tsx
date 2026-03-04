import { mdiMagnify } from '@lumx/icons';
import { IconButton, Toolbar, Heading } from '@lumx/react';

export default () => (
    <Toolbar
        label={<Heading typography="title">Toolbar title</Heading>}
        after={<IconButton label="Search" emphasis="low" icon={mdiMagnify} />}
    />
);
