import { useState } from 'react';
import { Checkbox, Theme } from '@lumx/react';

function useCheckBoxState(initial: boolean | 'intermediate') {
    const [isChecked, onChange] = useState(initial);
    return { isChecked, onChange };
}

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Checkbox label="Checkbox" {...useCheckBoxState(true)} theme={theme} />

        <Checkbox
            label="Checkbox with help"
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            {...useCheckBoxState(false)}
            theme={theme}
        />

        <Checkbox
            label="Disabled checkbox with help"
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            isDisabled
            theme={theme}
        />

        <Checkbox label="Checkbox intermediate state" {...useCheckBoxState('intermediate')} theme={theme} />
    </>
);
