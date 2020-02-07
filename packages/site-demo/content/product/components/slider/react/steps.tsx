import React, { useState } from 'react';

import { Slider } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState(40);
    return (
        <>
            <pre>{`Change temperature: ${value}°C`}</pre>
            <Slider max={180} min={30} steps={5} theme={theme} value={value} onChange={setValue} />
        </>
    );
};

export default App;
