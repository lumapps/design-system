import { useState } from 'react';
import { Slider, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState(40);
    return (
        <Slider
            label="Slider label"
            helper="Helper text"
            max={180}
            min={30}
            steps={5}
            theme={theme}
            value={value}
            onChange={setValue}
        />
    );
};
