import { Slider } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
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
