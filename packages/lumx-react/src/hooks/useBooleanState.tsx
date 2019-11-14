import { useState } from 'react';

const useBooleanState = (defaultValue: boolean): [boolean, () => void, () => void, () => void] => {
    const [booleanValue, setBoolean] = useState<boolean>(defaultValue);

    const setToFalse = (): void => {
        setBoolean(false);
    };

    const setToTrue = (): void => {
        setBoolean(true);
    };

    const toggleBoolean = (): void => {
        setBoolean(!booleanValue);
    };

    return [booleanValue, setToFalse, setToTrue, toggleBoolean];
};

export { useBooleanState };
