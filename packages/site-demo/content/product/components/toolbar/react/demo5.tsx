import { useState } from 'react';
import { mdiChevronLeft, mdiMagnify, mdiOpenInNew, mdiSort } from '@lumx/icons';
import { Button, FlexBox, IconButton, TextField, Toolbar, Heading } from '@lumx/react';

export default () => {
    const [value, setValue] = useState('');
    return (
        <Toolbar
            before={<IconButton label="Previous" emphasis="low" icon={mdiChevronLeft} />}
            label={
                <FlexBox orientation="horizontal" hAlign="center" gap="regular">
                    <Heading typography="title">Folder name</Heading>
                    <IconButton label="Previous" emphasis="low" icon={mdiOpenInNew} />
                </FlexBox>
            }
            after={
                <FlexBox orientation="horizontal" hAlign="center" gap="regular">
                    <TextField value={value} onChange={setValue} icon={mdiMagnify} />
                    <IconButton label="Grid" emphasis="low" icon={mdiSort} />
                    <Button>New</Button>
                </FlexBox>
            }
        />
    );
};
