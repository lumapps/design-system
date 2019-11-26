import React, { useState } from 'react';

import { Chip } from '@lumx/react';

const App = ({ theme }) => {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <Chip theme={theme} isSelected={selected === 0} onClick={() => setSelected(selected === 0 ? null : 0)}>
                Am
            </Chip>
            <Chip theme={theme} isSelected={selected === 1} onClick={() => setSelected(selected === 1 ? null : 1)}>
                Stram
            </Chip>
            <Chip theme={theme} isSelected={selected === 2} onClick={() => setSelected(selected === 2 ? null : 2)}>
                Gram
            </Chip>
            <Chip theme={theme} isSelected={selected === 3} onClick={() => setSelected(selected === 3 ? null : 3)}>
                Pic
            </Chip>
            <Chip theme={theme} isSelected={selected === 4} onClick={() => setSelected(selected === 4 ? null : 4)}>
                Pic
            </Chip>
            <Chip theme={theme} isSelected={selected === 5} onClick={() => setSelected(selected === 5 ? null : 5)}>
                Colegram
            </Chip>
        </>
    );
};

export default App;
