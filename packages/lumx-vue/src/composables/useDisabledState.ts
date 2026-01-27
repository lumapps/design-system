import { inject, InjectionKey, provide } from 'vue';

import { DisabledStateContextValue } from '@lumx/core/js/utils/disabledState';

const DISABLED_STATE_KEY: InjectionKey<DisabledStateContextValue> = Symbol('DISABLED_STATE_KEY');

export function useDisabledStateContext(): DisabledStateContextValue {
    return inject(DISABLED_STATE_KEY, { state: null });
}

export function provideDisabledState(value: DisabledStateContextValue) {
    provide(DISABLED_STATE_KEY, value);
}
