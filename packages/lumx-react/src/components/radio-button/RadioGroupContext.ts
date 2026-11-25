import { createContext } from 'react';
import type { RadioGroupState } from '@lumx/core/js/components/RadioGroup';

/** Context value provided by `RadioGroup` to its radios: the value, the name and the change handler. */
export const RadioGroupContext = createContext<RadioGroupState | undefined>(undefined);
