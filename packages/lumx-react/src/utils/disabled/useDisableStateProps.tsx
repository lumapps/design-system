type GenericProps = {
    disabled?: boolean;
    isDisabled?: boolean;
    'aria-disabled'?: boolean | 'true' | 'false';
    onClick?: any;
    onChange?: any;
};

interface Output<TProps extends GenericProps> {
    /** Is disabled or aria-disabled */
    isAnyDisabled?: boolean;
    disabledStateProps: { disabled?: boolean; 'aria-disabled'?: boolean };
    otherProps: TProps & { disabled: never; 'aria-disabled': never; isDisabled: never };
}

/**
 * Resolve disabled state from props.
 * (handles `disabled`, `isDisabled` and `aria-disabled`)
 *
 * @params component props
 */
export function useDisableStateProps<TProps extends GenericProps>(props: TProps): Output<TProps> {
    const { disabled, isDisabled = disabled, 'aria-disabled': ariaDisabled, onClick, onChange, ...otherProps } = props;
    const disabledStateProps = {
        disabled: isDisabled,
        'aria-disabled': ariaDisabled === true || ariaDisabled === 'true',
    };
    const isAnyDisabled = disabledStateProps['aria-disabled'] || disabledStateProps.disabled;
    if (!isAnyDisabled) {
        (otherProps as any).onClick = onClick;
        (otherProps as any).onChange = onChange;
    }
    return { disabledStateProps, otherProps: otherProps as Output<TProps>['otherProps'], isAnyDisabled };
}
