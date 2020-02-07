import { useState } from 'react';

const useBooleanState = (defaultValue: boolean): [boolean, () => void, () => void, () => void] => {
    const [booleanValue, setBoolean] = useState<boolean>(defaultValue);

    const setToFalse = () => {
        setBoolean(false);
    };

    const setToTrue = () => {
        setBoolean(true);
    };

    const toggleBoolean = () => {
        setBoolean(!booleanValue);
    };

    return [booleanValue, setToFalse, setToTrue, toggleBoolean];
};

export { useBooleanState };
