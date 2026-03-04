import { useState } from 'react';
import { mdiCloseCircle, mdiFilterVariant, mdiMenuDown } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [isSelected, setSelected] = useState(false);
    const onClick = () => !isSelected && setSelected(true);
    const onAfterClick = () => setSelected(!isSelected);
    return (
        <>
            <Chip
                theme={theme}
                after={<Icon icon={isSelected ? mdiCloseCircle : mdiMenuDown} size="xs" />}
                isSelected={isSelected}
                onClick={onClick}
                onAfterClick={onAfterClick}
            >
                Filter
            </Chip>

            <Chip
                theme={theme}
                before={<Icon icon={mdiFilterVariant} size="xs" />}
                after={<Icon icon={isSelected ? mdiCloseCircle : mdiMenuDown} size="xs" />}
                isSelected={isSelected}
                onClick={onClick}
                onAfterClick={onAfterClick}
            >
                Filter rich
            </Chip>
        </>
    );
};
