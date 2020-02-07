import React, { useState } from 'react';

import { mdiCloseCircle, mdiFilterVariant, mdiMenuDown } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    const [isSelected, setSelected] = useState(false);
    const onClick = () => !isSelected && setSelected(true);
    const onAfterClick = () => isSelected && setSelected(false);
    return (
        <div className="demo-grid">
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
                onClick={onClick}
                onAfterClick={onAfterClick}
            >
                Filter
            </Chip>
        </div>
    );
};

export default App;
