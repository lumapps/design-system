import { useState } from 'react';
import { Slider, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState(4.23765);
    return (
        <Slider
            label="Slider label"
            helper="Helper text"
            max={10}
            min={0}
            theme={theme}
            precision={5}
            value={value}
            onChange={setValue}
        />
    );
};
