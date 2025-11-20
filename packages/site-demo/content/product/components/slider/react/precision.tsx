import { Slider } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
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
