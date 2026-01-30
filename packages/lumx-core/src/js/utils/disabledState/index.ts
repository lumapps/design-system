/** Disable state */
export type DisabledStateContextValue =
    | {
          state: 'disabled';
      }
    | { state: undefined | null };

export type GenericProps = {
    disabled?: boolean;
    isDisabled?: boolean;
    'aria-disabled'?: boolean | 'true' | 'false';
    onClick?: any;
    onChange?: any;
    [key: string]: any;
};

export type DisabledState = {
    disabled: boolean;
    'aria-disabled': boolean;
};

/**
 * Calculate the disabled state based on context and props.
 */
export function getDisabledState(context: DisabledStateContextValue | undefined, props: GenericProps): DisabledState {
    const { disabled, isDisabled = disabled, 'aria-disabled': ariaDisabled } = props;
    return {
        disabled: context?.state === 'disabled' || !!isDisabled,
        'aria-disabled': ariaDisabled === true || ariaDisabled === 'true',
    };
}
