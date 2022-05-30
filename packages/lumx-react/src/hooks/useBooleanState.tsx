import { useCallback, useState } from 'react';

export const useBooleanState = (defaultValue: boolean): [boolean, () => void, () => void, () => void] => {
    const [booleanValue, setBoolean] = useState<boolean>(defaultValue);

    const setToFalse = useCallback(() => setBoolean(false), []);

    const setToTrue = useCallback(() => setBoolean(true), []);

    const toggleBoolean = useCallback(() => setBoolean((previousValue) => !previousValue), []);

    return [booleanValue, setToFalse, setToTrue, toggleBoolean];
};
