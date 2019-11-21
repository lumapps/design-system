import React, { useState } from 'react';

import { Slider } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState(20);
    return (
        <>
            <Slider
                className="demo-slider-half-width"
                max={100}
                min={0}
                hideMinMaxlabel
                theme={theme}
                value={value}
                onChange={setValue}
            />
        </>
    )
};

export default App;
