import React, { useContext } from 'react';

import chunk from 'lodash/chunk';

import { mdiMenuDown } from '@lumx/icons';
import { Button, FlexBox, List, ListItem, Popover, TextField } from '@lumx/react';
import { StoryFn } from '@storybook/react-vite';
import { GenericProps } from '@lumx/core/js/types';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';

import { MovingFocusProvider } from '../../components/MovingFocusProvider';
import { MovingFocusContext } from '../../components/MovingFocusProvider/context';
import { useVirtualFocus } from './useVirtualFocus';
import { useVirtualFocusParent } from './useVirtualFocusParent';

export default {
    title: 'utils/moving-focus/hooks/useVirtualFocus',
    // No need to snapshot these stories
    tags: ['!snapshot'],
};

// ListItem using the `useVirtualFocus()` hook to use virtual focus.
const VirtualFocusChild: React.FC<GenericProps> = ({
    id,
    isDisabled,
    isSelected,
    onItemSelected,
    children,
    ...props
}) => {
    const ref = React.useRef<HTMLLIElement>(null);
    const isHighlighted = useVirtualFocus(id, ref, isDisabled);
    const handleItemSelected = React.useCallback(() => {
        onItemSelected?.(id);
    }, [id, onItemSelected]);
    return (
        <ListItem
            ref={ref}
            role="none"
            linkProps={{ role: 'option', id, 'aria-selected': isSelected, tabIndex: -1 }}
            size="tiny"
            isHighlighted={isHighlighted}
            isDisabled={isDisabled}
            isSelected={isSelected}
            onItemSelected={handleItemSelected}
            {...props}
        >
            {children}
        </ListItem>
    );
};

// Button using the `useVirtualFocusParent()` hook to act as the parent of the virtual focus
const VirtualFocusParent = React.forwardRef<HTMLButtonElement, GenericProps>(
    ({ children, onItemSelected, 'aria-expanded': ariaExpanded, onClick, ...props }, ref) => {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const activeDescendant = useVirtualFocusParent(buttonRef);
        const handleKeyDown = React.useCallback<React.KeyboardEventHandler>(
            (evt) => {
                if (ariaExpanded && (evt.key === 'Enter' || evt.key === 'Space')) {
                    onItemSelected(activeDescendant);
                }
            },
            [ariaExpanded, onItemSelected, activeDescendant],
        );
        return (
            <Button
                ref={mergeRefs(buttonRef, ref)}
                onKeyDown={handleKeyDown}
                onClick={onClick}
                aria-expanded={ariaExpanded}
                aria-activedescendant={ariaExpanded ? activeDescendant : ''}
                emphasis="low"
                rightIcon={mdiMenuDown}
                style={{ border: '1px solid grey', textAlign: 'left' }}
                {...props}
            >
                <span style={{ display: 'inline-block', minWidth: 150 }}>{children}</span>
            </Button>
        );
    },
);

const options = [
    { id: 'option-1', name: 'Option 1' },
    { id: 'option-2', name: 'Option 2' },
    { id: 'option-3', name: 'Option 3', isDisabled: true },
    { id: 'option-4', name: 'Option 4' },
];

/**
 * Example usage of virtual focus to build a select-only combobox.
 * **Warning: this is a proof of concept to test virtual focus NOT a complete combobox implementation
 *            (not all required keyboard interactions are implemented)**
 */
export function Combobox() {
    const anchorRef = React.useRef(null);
    const [isOpen, close, , toggleOpen] = useBooleanState(false);
    const [value, setValue] = React.useState('');
    return (
        <>
            <Button emphasis="low">Focus before</Button>
            <MovingFocusProvider options={{ direction: 'vertical', loopAround: true, defaultSelectedId: value }}>
                <VirtualFocusParent
                    ref={anchorRef}
                    role="combobox"
                    aria-label="Select an option"
                    aria-haspopup="listbox"
                    aria-controls="listbox-1"
                    aria-expanded={isOpen}
                    onClick={toggleOpen}
                    onItemSelected={setValue}
                >
                    {value && options.find(({ id }) => value === id)?.name}
                </VirtualFocusParent>
                <Popover
                    role="none"
                    isOpen={isOpen}
                    anchorRef={anchorRef}
                    closeOnClickAway
                    onClose={close}
                    fitToAnchorWidth
                >
                    <List role="listbox" id="listbox-1" isClickable aria-label="Select an option">
                        {options.map(({ id, name, isDisabled }) => (
                            <VirtualFocusChild
                                key={name}
                                id={id}
                                isDisabled={isDisabled}
                                isSelected={value === id}
                                onItemSelected={setValue}
                            >
                                {name}
                            </VirtualFocusChild>
                        ))}
                    </List>
                </Popover>
            </MovingFocusProvider>
            <Button emphasis="low">Focus after</Button>
        </>
    );
}

const InputVirtualFocusParent = React.forwardRef<HTMLInputElement, GenericProps>(
    ({ onItemSelected, onChange, value, ...props }: GenericProps, ref) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const { dispatch } = useContext(MovingFocusContext);

        const activeDescendant = useVirtualFocusParent(inputRef);

        const handleKeyDown = React.useCallback<React.KeyboardEventHandler>(
            (evt) => {
                if (activeDescendant) {
                    switch (evt.key) {
                        case 'Enter':
                        case 'Space':
                            onItemSelected(activeDescendant);
                            dispatch({ type: 'RESET_SELECTED_TAB_STOP' });
                            break;
                        case 'Escape':
                            dispatch({ type: 'RESET_SELECTED_TAB_STOP' });
                            break;
                        default:
                            break;
                    }
                }
            },
            [activeDescendant, onItemSelected, dispatch],
        );
        return (
            <TextField
                value={value}
                onChange={onChange}
                inputRef={mergeRefs(ref, inputRef)}
                onKeyDown={handleKeyDown}
                aria-activedescendant={activeDescendant ?? ''}
                {...props}
            />
        );
    },
);

// ListItem using the `useVirtualFocus()` hook to use virtual focus.
const VirtualFocusGridChild: React.FC<GenericProps> = ({
    id,
    isDisabled,
    rowKey,
    isSelected,
    onItemSelected,
    children,
}) => {
    const ref = React.useRef<HTMLButtonElement>(null);
    const isHighlighted = useVirtualFocus(id, ref, isDisabled, rowKey);
    const { dispatch } = useContext(MovingFocusContext);

    const handleSelect = () => {
        onItemSelected(id);
        dispatch({ type: 'RESET_SELECTED_TAB_STOP' });
    };

    return (
        <Button
            ref={ref}
            role="option"
            id={id}
            aria-selected={isSelected}
            onClick={handleSelect}
            tabIndex={-1}
            data-focus-visible-added={isHighlighted ? 'true' : undefined}
            isSelected={isSelected}
        >
            {children}
        </Button>
    );
};

const rowOptions = [
    { id: 'option-1', name: 'Ina Garza' },
    { id: 'option-2', name: 'Beulah Matthews' },
    { id: 'option-3', name: 'Lela Brooks' },
    { id: 'option-4', name: 'Georgie Evans' },
    { id: 'option-5', name: 'Sally Cobb' },
    { id: 'option-6', name: 'Allie Vega' },
    { id: 'option-7', name: 'Alfred Graves' },
    { id: 'option-8', name: 'Virgie Lindsey' },
    { id: 'option-9', name: 'Tom Simpson' },
    { id: 'option-10', name: 'Blake McCormick' },
];
const optionsToRows = chunk(rowOptions, 2);

export const WithGrid: StoryFn<any> = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState('');

    const handleSelect = (id: string) => {
        const option = rowOptions.find(({ id: optionId }) => id === optionId);
        if (option?.name) {
            setValue(option?.name);
            inputRef?.current?.focus();
        }
    };

    return (
        <>
            <Button emphasis="low">Focus before</Button>
            <MovingFocusProvider
                options={{
                    direction: 'both',
                    firstFocusDirection: 'vertical',
                    loopAround: true,
                    defaultSelectedId: value,
                }}
            >
                <InputVirtualFocusParent
                    ref={inputRef}
                    role="combobox"
                    aria-label="Select an option"
                    aria-haspopup="listbox"
                    aria-controls="listbox-1"
                    value={value}
                    onChange={setValue}
                    onItemSelected={handleSelect}
                />
                <FlexBox orientation="vertical" gap="regular">
                    {optionsToRows.map((opts, rowIndex) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <FlexBox key={rowIndex} orientation="horizontal" gap="regular">
                            {opts.map((option) => (
                                <VirtualFocusGridChild
                                    key={option.id}
                                    id={option.id}
                                    rowKey={rowIndex}
                                    onItemSelected={handleSelect}
                                >
                                    {option.name}
                                </VirtualFocusGridChild>
                            ))}
                        </FlexBox>
                    ))}
                </FlexBox>
            </MovingFocusProvider>
            <Button emphasis="low">Focus after</Button>
        </>
    );
};
