import React from 'react';

import { MovingFocusContext, useVirtualFocus } from '@lumx/react/utils';
import { GenericProps } from '@lumx/core/js/types';
import { useId } from '../../../../hooks/useId';

import { useComboboxOptionContext } from '../../context/ComboboxOptionContext';
import { useComboboxRefs } from '../../context/ComboboxRefsContext';
import { useRegisterOption } from '../../hooks/useRegisterOption';
import { RegisteredComboboxAction } from '../../types';

interface ComboboxOptionActionProps extends GenericProps {
    /** Should the action be set as disabled  */
    isDisabled?: boolean;
    /** Action to trigger when the action is selected */
    onClick: () => void;
    /** Customize the root element. */
    as?: React.ElementType;
}

/**
 * Action to set on a Combobox Option.
 * Allows to add an interactive element that
 * can be navigated to and triggered using the keyboard.
 *
 * Defaults as "button"
 *
 * @family Combobox
 * @param ComboboxOptionActionProps
 * @returns ComboboxOptionAction
 */
export const ComboboxOptionAction = (props: ComboboxOptionActionProps) => {
    const { as, isDisabled, onClick, id: originalId, ...forwardedProps } = props;
    const { optionId } = useComboboxOptionContext();
    const { triggerRef } = useComboboxRefs();
    const itemRef = React.useRef<any>(null);

    const generatedId = useId();
    const id = originalId || generatedId;

    const isHighlighted = useVirtualFocus(id, itemRef, isDisabled, optionId);
    const { state } = React.useContext(MovingFocusContext);

    const Component = as || 'button';

    const registeredActionOption: RegisteredComboboxAction = React.useMemo(
        () => ({
            id,
            generatedId: id,
            isAction: true,
            isDisabled,
            onSelect: () => {
                itemRef.current?.click();
            },
        }),
        [id, isDisabled],
    );

    // Register the option
    useRegisterOption(id, registeredActionOption, !isDisabled);

    const handleActionClick = React.useCallback(() => {
        if (onClick) {
            onClick();
        }
        if (triggerRef?.current) {
            triggerRef.current?.focus();
        }
    }, [triggerRef, onClick]);

    return (
        <Component
            {...forwardedProps}
            isDisabled={isDisabled}
            id={id}
            role="gridcell"
            ref={itemRef}
            data-focus-visible-added={state.isUsingKeyboard && isHighlighted ? 'true' : undefined}
            aria-disabled={isDisabled}
            onClick={handleActionClick}
        />
    );
};
