import { Checkbox, CheckboxProps } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const useCheckBoxState = (initial: CheckboxProps['isChecked']) => {
        const [isChecked, onChange] = useState(initial);
        return { isChecked, onChange };
    };

    return (
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
};
