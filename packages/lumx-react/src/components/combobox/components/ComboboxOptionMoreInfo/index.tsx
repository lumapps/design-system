import React from 'react';

import { A11YLiveMessage } from '@lumx/react/utils/A11YLiveMessage';
import { classNames } from '@lumx/core/js/utils';
import { mdiInformationOutline } from '@lumx/icons';
import { IconButton, IconButtonProps, Popover, PopoverProps } from '@lumx/react';
import { useBooleanState } from '../../../../hooks/useBooleanState';

import { useComboboxOptionContext } from '../../context/ComboboxOptionContext';

export interface ComboboxOptionMoreInfoProps {
    buttonProps?: Partial<IconButtonProps>;
    popoverProps?: PopoverProps;
    onToggle?: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

const CLASSNAME = 'lumx-combobox-option-more-info';

const { block, element } = classNames.bem(CLASSNAME);

/**
 * Display more info on the option as a popover opening on mouse hover or keyboard nav
 * Please consider using a simpler option description instead for better UX and a11y.
 *
 * @family Combobox
 */
export const ComboboxOptionMoreInfo: React.FC<ComboboxOptionMoreInfoProps> = ({
    buttonProps,
    popoverProps,
    onToggle,
    children,
}) => {
    const ref = React.useRef<HTMLButtonElement | null>(null);
    const [isHovered, , onMouseLeave, onMouseEnter] = useBooleanState(false);

    const comboboxOption = useComboboxOptionContext();

    // Open on mouse hover or key nav
    const isOpen = isHovered || comboboxOption.isKeyboardHighlighted;

    React.useEffect(() => {
        onToggle?.(isOpen);
    }, [isOpen, onToggle]);

    return (
        <>
            <IconButton
                {...buttonProps}
                ref={ref}
                className={block([buttonProps?.className])}
                icon={mdiInformationOutline}
                size="s"
                emphasis="low"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                // Button actually plays no role here other than a target for the mouse hover
                // Keyboard accessibility is handled via combobox keyboard highlighting
                aria-hidden
                label=""
            />
            <Popover
                {...popoverProps}
                className={element('popover', [popoverProps?.className])}
                anchorRef={ref}
                isOpen={isOpen}
                closeOnEscape
                closeOnClickAway
                placement="bottom-start"
            >
                {children}
            </Popover>
            <A11YLiveMessage hidden>{isOpen ? children : undefined}</A11YLiveMessage>
        </>
    );
};
