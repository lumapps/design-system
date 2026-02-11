import { useContext } from 'react';

import { SectionContext } from '../context/ComboboxContext';

/** Retrieve the current combobox section id */
export const useComboboxSectionId = () => {
    return useContext(SectionContext);
};
