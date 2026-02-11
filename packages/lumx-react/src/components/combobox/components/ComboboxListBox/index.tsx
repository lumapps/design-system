import React, { ReactNode } from 'react';

import { bem, visuallyHidden } from '@lumx/core/js/utils/classNames';
import { GenericBlock, Heading, Placement, Popover, PopoverProps, Text, type GenericProps } from '@lumx/react';

import { useComboboxRefs } from '../../context/ComboboxRefsContext';
import { useCombobox } from '../../hooks/useCombobox';
import { ComboboxListSkeleton, ComboboxListSkeletonProps } from './ComboboxListSkeleton';

export interface ComboboxListBoxProps extends GenericProps, React.ComponentProps<'ul'> {
    /** Options display in the combobox */
    children?: ReactNode;
    /**
     * Component to use as skeleton for each option instead of the default one.
     * Can either be a react node or a component that receives the index as prop
     */
    renderItemSkeleton?: ComboboxListSkeletonProps['children'];
    /** Label for the list */
    label?: string;
    /** Props of the popover element. */
    popoverProps?: Partial<PopoverProps>;
    /**
     * An element to display at the bottom of the listbox.
     * No interactive element must be set here as they will not be accessible.
     */
    footer?: ReactNode;
    /** List ref */
    listRef?: React.Ref<HTMLElement>;
}

/** The states in which the full loading must be displayed */
const FULL_LOADING_STATES = ['loading', 'debouncing', 'filtering'];
const CLASSNAME = 'lumx-combobox-listbox';

const { block, element } = bem(CLASSNAME);

/**
 * The listbox containing the combobox's options.
 *
 * @family Combobox
 * @param ComboboxListBoxProps
 * @returns ComboboxListBox
 */
export const ComboboxListBox = ({
    children,
    renderItemSkeleton,
    label,
    popoverProps,
    footer,
    listRef,
    ...forwardedProps
}: ComboboxListBoxProps) => {
    const {
        status,
        listboxId,
        isOpen,
        optionsLength,
        handleClose: contextHandleClose,
        type,
        inputValue,
        showEmptyState,
        showErrorState,
        translations,
    } = useCombobox();
    const { anchorRef } = useComboboxRefs();
    const { onClose, ...otherPopoverProps } = popoverProps || {};
    const { style, className, ...listProps } = forwardedProps;
    // The states to show a full skeleton instead of the options
    const showFullLoading = FULL_LOADING_STATES.includes(status);

    const isErrorStateDisplayed = showErrorState && isOpen && status === 'error';
    const isEmptyStateDisplayed = showEmptyState && isOpen && status === 'idle' && optionsLength === 0;

    /**
     *  The conditions in which we want to show the content of the popover
     *  * The parent asked for the popover to be opened
     *  * There is at least one option to displayed OR a skeleton
     */
    const showPopover =
        (isOpen && (optionsLength > 0 || showFullLoading)) || isEmptyStateDisplayed || isErrorStateDisplayed;

    const handleClose = () => {
        if (isOpen) {
            contextHandleClose?.();
            onClose?.();
        }
    };

    const emptyMessage = translations.noResultsForInputLabel(inputValue);

    return (
        <>
            {/* Read changes in available options by a screen reader */}
            <Text as="p" className={visuallyHidden()} role="log" aria-live="assertive">
                {isOpen &&
                    !showFullLoading &&
                    !isEmptyStateDisplayed &&
                    !isErrorStateDisplayed &&
                    translations.nbOptionsLabel(optionsLength)}
                {isErrorStateDisplayed && `${translations.serviceUnavailableLabel} ${translations.tryReloadLabel}`}
                {showFullLoading && translations.loadingLabel}
                {isEmptyStateDisplayed && emptyMessage}
            </Text>
            <Popover
                role="none"
                onClose={handleClose}
                anchorRef={anchorRef}
                fitToAnchorWidth
                fitWithinViewportHeight
                closeOnEscape
                closeOnClickAway
                placement={Placement.BOTTOM}
                isOpen={isOpen}
                {...otherPopoverProps}
            >
                <div
                    style={{
                        ...style,
                        overflowY: 'auto',
                        display: showPopover ? 'flex' : 'none',
                        flexDirection: 'column',
                    }}
                >
                    {/**
                     * The DS `List` component has a lot of behavior / default props we do not want here.
                     * So we use a native ul tag.
                     */}
                    <ul
                        ref={listRef as React.Ref<HTMLUListElement>}
                        id={listboxId}
                        role={type}
                        aria-label={label}
                        className={block([className, 'lumx-list lumx-list--item-padding-big'])}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                        }}
                        {...listProps}
                    >
                        {/* Only show children if a full skeleton isn't already displayed */}
                        {!showFullLoading && children}
                        {[...FULL_LOADING_STATES, 'loadingMore'].includes(status) && (
                            <ComboboxListSkeleton isLoadingMore={status === 'loadingMore'}>
                                {renderItemSkeleton}
                            </ComboboxListSkeleton>
                        )}
                    </ul>
                    {footer}
                    {(isEmptyStateDisplayed || isErrorStateDisplayed) && (
                        <GenericBlock className={element('state')} orientation="vertical" vAlign="center">
                            <GenericBlock.Content>
                                {inputValue && isEmptyStateDisplayed && (
                                    <Text
                                        as="p"
                                        typography="body1"
                                        color="dark"
                                        colorVariant="L2"
                                        dangerouslySetInnerHTML={{
                                            __html: translations.noResultsForInputLabel(inputValue),
                                        }}
                                    />
                                )}
                                {!inputValue && isEmptyStateDisplayed && (
                                    <Text as="p" typography="body1" color="dark" colorVariant="L2">
                                        {translations.noResultsForInputLabel()}
                                    </Text>
                                )}
                                {isErrorStateDisplayed && (
                                    <>
                                        <Heading as="h2" typography="subtitle2">
                                            {translations.serviceUnavailableLabel}
                                        </Heading>
                                        <Text as="p" typography="body1" color="dark" colorVariant="L2">
                                            {translations.tryReloadLabel}
                                        </Text>
                                    </>
                                )}
                            </GenericBlock.Content>
                        </GenericBlock>
                    )}
                </div>
            </Popover>
        </>
    );
};
