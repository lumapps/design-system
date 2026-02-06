import { computed, ComputedRef, unref } from 'vue';
import { getDisabledState, GenericProps, DisabledState } from '@lumx/core/js/utils/disabledState';
import { useDisabledStateContext } from './useDisabledState';

interface Output<TProps extends GenericProps> {
    /** Is disabled or aria-disabled */
    isAnyDisabled: ComputedRef<boolean | undefined>;
    disabledStateProps: ComputedRef<DisabledState>;
    otherProps: ComputedRef<Omit<TProps, 'disabled' | 'isDisabled' | 'aria-disabled' | 'ariaDisabled'>>;
}

/**
 * Resolve disabled state from props.
 * (handles `disabled`, `isDisabled` and `aria-disabled`)
 *
 * @params component props
 */
export function useDisableStateProps<TProps extends GenericProps>(
    props: TProps | ComputedRef<TProps> | (() => TProps),
): Output<TProps> {
    const disabledStateContext = useDisabledStateContext();

    const disabledStateProps = computed(() => {
        const p = typeof props === 'function' ? props() : unref(props);
        return getDisabledState(disabledStateContext, {
            disabled: p.disabled,
            isDisabled: p.isDisabled,
            'aria-disabled': p['aria-disabled'] ?? p.ariaDisabled,
        });
    });

    const isAnyDisabled = computed(
        () => disabledStateProps.value['aria-disabled'] || disabledStateProps.value.disabled || undefined,
    );

    const otherProps = computed(() => {
        const p = typeof props === 'function' ? props() : unref(props);
        const { disabled, isDisabled, 'aria-disabled': _, ariaDisabled, onClick, onChange, ...rest } = p as any;

        // Only include onClick/onChange if not disabled (matching React behavior)
        if (!isAnyDisabled.value) {
            if (onClick) (rest as any).onClick = onClick;
            if (onChange) (rest as any).onChange = onChange;
        }

        return rest;
    });

    return { disabledStateProps, isAnyDisabled, otherProps };
}
