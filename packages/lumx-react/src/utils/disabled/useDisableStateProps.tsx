import { getDisabledState, GenericProps, DisabledState } from '@lumx/core/js/utils/disabledState';
import { useDisabledStateContext } from './DisabledStateContext';

interface Output<TProps extends GenericProps> {
    /** Is disabled or aria-disabled */
    isAnyDisabled?: boolean;
    disabledStateProps: DisabledState;
    otherProps: TProps & { disabled: never; 'aria-disabled': never; isDisabled: never };
}

/**
 * Resolve disabled state from props.
 * (handles `disabled`, `isDisabled` and `aria-disabled`)
 *
 * @params component props
 */
export function useDisableStateProps<TProps extends GenericProps>(props: TProps): Output<TProps> {
    const { disabled, isDisabled, 'aria-disabled': ariaDisabled, onClick, onChange, ...otherProps } = props;
    const disabledStateContext = useDisabledStateContext();
    const disabledStateProps = getDisabledState(disabledStateContext, {
        disabled,
        isDisabled,
        'aria-disabled': ariaDisabled,
    });
    const isAnyDisabled = disabledStateProps['aria-disabled'] || disabledStateProps.disabled || undefined;
    if (!isAnyDisabled) {
        (otherProps as any).onClick = onClick;
        (otherProps as any).onChange = onChange;
    }
    return { disabledStateProps, otherProps: otherProps as Output<TProps>['otherProps'], isAnyDisabled };
}
