import React, { useState } from 'react';

import { Slider } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState(4.23765);
    const [value2, setValue2] = useState(42.99);
    return (
        <>
            <pre>{`Rocket science precision: ${value}`}</pre>
            <Slider max={10} min={0} theme={theme} precision={5} value={value} onChange={setValue} />
            <br />
            <pre>{`Change price: $${value2}`}</pre>
            <Slider max={120} min={0} theme={theme} precision={2} value={value2} onChange={setValue2} />
        </>
    );
};

export default App;
