import { Checkbox } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React, { useState } from 'react';

export default { title: 'Checkbox' };

export const Simple = ({ theme }: any) => {
    const [value, setValue] = useState(false);
    return <Checkbox value={value} label={text('Label', 'My label')} theme={theme} onChange={setValue} />;
};

export const Disabled = ({ theme }: any) => {
    return (
        <Checkbox
            value={false}
            label={text('Label', 'My label')}
            helper={text('Helper', 'You will receive our newsletter each month')}
            theme={theme}
            onChange={noop}
            disabled
        />
    );
};

export const WithHelper = ({ theme }: any) => {
    const [value, setValue] = useState(false);
    return (
        <Checkbox
            value={value}
            label={text('Label', 'My label')}
            helper={text('Helper', 'You will receive our newsletter each month')}
            theme={theme}
            onChange={setValue}
        />
    );
};
