import React, { useState } from 'react';

import { mdiCloseCircle, mdiFilterVariant, mdiMenuDown } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

const App = ({ theme }) => {
    const [isSelected, setSelected] = useState(false);

    return (
        <>
            <Chip
                theme={theme}
                before={<Icon icon={mdiFilterVariant} size={Size.xs} />}
                after={
                    isSelected ? (
                        <Icon icon={mdiCloseCircle} size={Size.xs} />
                    ) : (
                        <Icon icon={mdiMenuDown} size={Size.xs} />
                    )
                }
                isSelected={isSelected}
                onClick={() => !isSelected && setSelected(true)}
                onAfterClick={() => isSelected && setSelected(false)}
            >
                Filter
            </Chip>
        </>
    );
};

export default App;
