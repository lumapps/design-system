import { mdiMenuDown, mdiTranslate } from '@lumx/icons';
import { Button, Toolbar, Heading } from '@lumx/react';

export default () => (
    <Toolbar
        label={<Heading typography="title">Toolbar title</Heading>}
        after={
            <Button emphasis="low" leftIcon={mdiTranslate} rightIcon={mdiMenuDown}>
                Value
            </Button>
        }
    />
);
