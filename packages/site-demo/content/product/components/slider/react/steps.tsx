import { Slider } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
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
