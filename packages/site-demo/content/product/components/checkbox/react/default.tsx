import { Checkbox } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState(true);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(false);

    return (
        <>
            <Checkbox value={value} label="Checkbox" theme={theme} onChange={setValue}/>

            <Checkbox
                value={value2}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Checkbox with help"
                theme={theme}
                onChange={setValue2}
            />

            <Checkbox
                value={value3}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Disabled checkbox with help"
                theme={theme}
                onChange={setValue3}
                disabled
            />
        </>
    );
};

export default App;
