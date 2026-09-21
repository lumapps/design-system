import { useState } from 'react';
import { FlexBox, InputRequiredLegend, TextField, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [firstName, setFirstName] = useState('');
    const [nickname, setNickname] = useState('');
    return (
        <FlexBox as="form" orientation="vertical" gap="regular">
            <InputRequiredLegend label="Indicates a required field" theme={theme} />
            <TextField label="First name" value={firstName} onChange={setFirstName} isRequired theme={theme} />
            <TextField label="Nickname" value={nickname} onChange={setNickname} theme={theme} />
        </FlexBox>
    );
};
