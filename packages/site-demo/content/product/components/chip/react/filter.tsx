import { mdiCloseCircle, mdiFilterVariant, mdiMenuDown } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [isSelected, setSelected] = useState(false);
    const onClick = () => !isSelected && setSelected(true);
    const onAfterClick = () => setSelected(!isSelected);

    return (
        <>
            <Chip
                theme={theme}
                after={<Icon icon={isSelected ? mdiCloseCircle : mdiMenuDown} size={Size.xs} />}
                isSelected={isSelected}
                onClick={onClick}
                onAfterClick={onAfterClick}
            >
                Filter
            </Chip>

            <Chip
                theme={theme}
                before={<Icon icon={mdiFilterVariant} size={Size.xs} />}
                after={<Icon icon={isSelected ? mdiCloseCircle : mdiMenuDown} size={Size.xs} />}
                isSelected={isSelected}
                onClick={onClick}
                onAfterClick={onAfterClick}
            >
                Filter rich
            </Chip>
        </>
    );
};
