import { computed, ComputedRef, unref } from 'vue';
import { getDisabledState, GenericProps, DisabledState } from '@lumx/core/js/utils/disabledState';
import { useDisabledStateContext } from './useDisabledState';

interface Output {
    /** Is disabled or aria-disabled */
    isAnyDisabled: ComputedRef<boolean>;
    disabledStateProps: ComputedRef<DisabledState>;
}

/**
 * Resolve disabled state from props.
 * (handles `disabled`, `isDisabled` and `aria-disabled`)
 *
 * @params component props
 */
export function useDisableStateProps(props: GenericProps | ComputedRef<GenericProps> | (() => GenericProps)): Output {
    const disabledStateContext = useDisabledStateContext();

    const disabledStateProps = computed(() => {
        const p = typeof props === 'function' ? props() : unref(props);
        return getDisabledState(disabledStateContext, {
            disabled: p.disabled,
            isDisabled: p.isDisabled,
            'aria-disabled': p['aria-disabled'],
        });
    });

    const isAnyDisabled = computed(
        () => disabledStateProps.value['aria-disabled'] || disabledStateProps.value.disabled,
    );

    return { disabledStateProps, isAnyDisabled };
}
