import { useState } from 'react';
import { Chip, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [selected, setSelected] = useState(-1);
    const indexedProps = (index: number) => ({
        isSelected: selected === index,
        onClick: () => setSelected(selected === index ? -1 : index),
    });
    return (
        <>
            <Chip theme={theme} {...indexedProps(0)}>
                Am
            </Chip>

            <Chip theme={theme} {...indexedProps(1)}>
                Stram
            </Chip>

            <Chip theme={theme} {...indexedProps(2)}>
                Gram
            </Chip>

            <Chip theme={theme} {...indexedProps(3)}>
                Pic
            </Chip>

            <Chip theme={theme} {...indexedProps(4)}>
                Pic
            </Chip>

            <Chip theme={theme} {...indexedProps(5)}>
                Colegram
            </Chip>
        </>
    );
};
