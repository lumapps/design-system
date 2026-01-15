import { useState } from 'react';
import { mdiMagnify, mdiViewGrid } from '@lumx/icons';
import { Button, FlexBox, IconButton, TextField, Toolbar, Heading } from '@lumx/react';

export default () => {
    const [value, setValue] = useState('');
    return (
        <Toolbar
            label={
                <FlexBox orientation="horizontal" hAlign="center" gap="big">
                    <Heading typography="title">Toolbar title</Heading>

                    <TextField value={value} onChange={setValue} icon={mdiMagnify} />
                </FlexBox>
            }
            after={
                <FlexBox orientation="horizontal" hAlign="center" gap="regular">
                    <IconButton label="Grid" emphasis="low" icon={mdiViewGrid} />

                    <Button>Action</Button>
                </FlexBox>
            }
        />
    );
};
