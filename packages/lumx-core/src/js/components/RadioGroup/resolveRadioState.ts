import type { RadioGroupState } from '.';

/**
 * Resolve the checked state and the name of a radio from its own props and its group.
 * A prop set on the radio wins over the group.
 */
export function resolveRadioState(
    radio: { isChecked?: boolean; name?: string; value?: string },
    group?: RadioGroupState,
): { isChecked?: boolean; name?: string } {
    const isControlled = group?.isControlled || group?.value !== undefined;
    const isCheckedByGroup = isControlled ? group?.value !== undefined && group.value === radio.value : undefined;
    return { isChecked: radio.isChecked ?? isCheckedByGroup, name: radio.name ?? group?.name };
}
