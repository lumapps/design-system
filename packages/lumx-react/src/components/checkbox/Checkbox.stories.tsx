import { Checkbox } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React, { useState } from 'react';

export default { title: 'LumX components/checkbox/Checkbox' };

export const SimpleSelect = ({ theme }: any) => {
    const [value, setValue] = useState(false);
    return <Checkbox isChecked={value} label={text('Label', 'My label')} theme={theme} onChange={setValue} />;
};

export const DisabledSelect = ({ theme }: any) => {
    return (
        <Checkbox
            isChecked={false}
            label={text('Label', 'My label')}
            helper={text('Helper', 'You will receive our newsletter each month')}
            theme={theme}
            onChange={noop}
            isDisabled
        />
    );
};

export const WithHelperSelect = ({ theme }: any) => {
    const [value, setValue] = useState(false);
    return (
        <Checkbox
            isChecked={value}
            label={text('Label', 'My label')}
            helper={text('Helper', 'You will receive our newsletter each month')}
            theme={theme}
            onChange={setValue}
        />
    );
};
