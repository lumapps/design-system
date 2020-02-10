import React, { useState } from 'react';

import { Slider } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState(20);
    return (
        <>
            <Slider max={100} min={0} hideMinMaxlabel theme={theme} value={value} onChange={setValue} />
        </>
    );
};

export default App;
