import { type InjectionKey, inject, provide } from 'vue';
import type { RadioGroupState } from '@lumx/core/js/components/RadioGroup';

const RADIO_GROUP_CONTEXT_KEY: InjectionKey<RadioGroupState> = Symbol('radio-group-context');

/** Provide the radio group context (see `RadioGroup`). */
export function provideRadioGroupContext(value: RadioGroupState) {
    provide(RADIO_GROUP_CONTEXT_KEY, value);
}

/** Access the radio group context, or `undefined` outside of a `RadioGroup` (does not throw). */
export function useOptionalRadioGroupContext(): RadioGroupState | undefined {
    return inject(RADIO_GROUP_CONTEXT_KEY, undefined);
}
