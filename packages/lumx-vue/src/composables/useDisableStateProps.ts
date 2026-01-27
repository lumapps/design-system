import { computed, ComputedRef } from 'vue';
import { getDisabledState, GenericProps, DisabledState } from '@lumx/core/js/utils/disabledState';
import { useDisabledStateContext } from './useDisabledState';

interface Output {
    /** Is disabled or aria-disabled */
    isAnyDisabled: ComputedRef<boolean>;
    disabledStateProps: ComputedRef<DisabledState>;
    otherProps: ComputedRef<any>;
}

/**
 * Resolve disabled state from props.
 * (handles `disabled`, `isDisabled` and `aria-disabled`)
 *
 * @params component props
 */
export function useDisableStateProps(props: GenericProps): Output {
    const disabledStateContext = useDisabledStateContext();

    const disabledStateProps = computed(() =>
        getDisabledState(disabledStateContext, {
            disabled: props.disabled,
            isDisabled: props.isDisabled,
            'aria-disabled': props['aria-disabled'],
        }),
    );

    const isAnyDisabled = computed(
        () => disabledStateProps.value['aria-disabled'] || disabledStateProps.value.disabled,
    );

    const otherProps = computed(() => {
        const { disabled, isDisabled, 'aria-disabled': ariaDisabled, onClick, onChange, ...rest } = props;

        const result: any = { ...rest };

        if (!isAnyDisabled.value) {
            if (onClick) {
                result.onClick = onClick;
            }
            if (onChange) {
                result.onChange = onChange;
            }
        }
        return result;
    });

    return { disabledStateProps, otherProps, isAnyDisabled };
}
