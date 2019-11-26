import React, { useState } from 'react';

import { Checkbox } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState(true);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(false);

    return (
        <>
            <div className="lumx-spacing-margin-bottom-big">
                <Checkbox value={value} label="Checkbox" theme={theme} onChange={setValue} />
            </div>
            <div className="lumx-spacing-margin-bottom-big">
                <Checkbox
                    value={value2}
                    helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                    label="Checkbox with help"
                    theme={theme}
                    onChange={setValue2}
                />
            </div>
            <Checkbox
                value={value3}
                helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
                label="Disable checkbox with help"
                theme={theme}
                disabled
                onChange={setValue3}
            />
        </>
    );
};

export default App;
