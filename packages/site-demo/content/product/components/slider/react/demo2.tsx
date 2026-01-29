import { useState } from 'react';
import { Slider, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState(20);
    return (
        <Slider
            label="Slider label"
            helper="Helper text"
            max={100}
            min={0}
            hideMinMaxLabel
            theme={theme}
            value={value}
            onChange={setValue}
        />
    );
};
