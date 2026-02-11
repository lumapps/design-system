import React from 'react';

import { RegisteredComboboxOption } from '../types';
import { useCombobox } from './useCombobox';

/**
 * Register the given option to the context
 */
export const useRegisterOption = (registerId: string, option: RegisteredComboboxOption, shouldRegister?: boolean) => {
    const { dispatch } = useCombobox();

    /** Register the given options */
    React.useEffect(() => {
        if (option && shouldRegister) {
            dispatch({ type: 'ADD_OPTION', payload: { id: registerId, option } });
        }

        // Unregister ids if/when the component unmounts or if option changes
        return () => {
            if (option) {
                dispatch({ type: 'REMOVE_OPTION', payload: { id: registerId } });
            }
        };
    }, [dispatch, option, registerId, shouldRegister]);
};
