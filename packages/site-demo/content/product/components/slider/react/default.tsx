import React, { useState } from 'react';

import { Slider } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState(4);
    return (
        <>
            <pre>{`Adjust threshold: ${value}`}</pre>
            <br />
            <Slider
                label="Default"
                helper="This is an helper text"
                max={10}
                min={0}
                theme={theme}
                value={value}
                onChange={setValue}
            />
        </>
    );
};

export default App;
