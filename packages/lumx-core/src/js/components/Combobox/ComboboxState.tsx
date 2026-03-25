import type { LumxClassName } from '../../types';
import { classNames } from '../../utils';
import type { TextProps } from '../Text';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxState';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-state';
const { block } = classNames.bem(CLASSNAME);

/**
 * Defines the props for the core ComboboxState template.
 */
export interface ComboboxStateProps {
    /**
     * Message to display when the list has no visible options.
     * Can be a plain string or a function receiving the current input value (for dynamic messages).
     * When omitted, the empty state is not shown.
     */
    emptyMessage?: string | ((inputValue: string) => string);
    /**
     * Error state title message.
     * When provided, the error state is active (takes priority over the empty state).
     * When omitted, the error state is not shown.
     */
    errorMessage?: string;
    /**
     * Secondary error message (e.g. "Please try again").
     * Only rendered when `errorMessage` is provided.
     */
    errorTryReloadMessage?: string;
    /**
     * Message to announce when loading persists (after a 500ms debounce).
     * When omitted, no loading announcement is made.
     */
    loadingMessage?: string;
    /**
     * List state
     */
    state?: {
        /**
         * Whether the list currently has no visible options.
         * Driven by the framework wrapper via the combobox handle's `emptyChange` event.
         */
        isEmpty?: boolean;
        /**
         * The current value of the combobox input.
         * Passed to `emptyMessage` when it is a function.
         */
        inputValue?: string;
        /**
         * Whether loading is active (immediate, from `loadingChange` event).
         * Used to suppress false "empty" state while data is loading.
         */
        isLoading?: boolean;
    };
}

/**
 * Components injected by the framework wrapper (dependency injection).
 */
export interface ComboboxStateComponents {
    /**
     * GenericBlock component (framework-specific, e.g. React GenericBlock with FlexBox handling).
     */
    GenericBlock: any;
    /**
     * Text component (framework-specific, e.g. React Text or Vue Text).
     */
    Text: (props: TextProps) => any;
}

/**
 * ComboboxState core template.
 * Renders empty/error state messages inside the combobox popover.
 * The block itself acts as a screen reader live region (`role="status" aria-live="polite"`).
 *
 * Activation rules:
 * - Error state: active when `errorMessage` is provided (presence-based).
 * - Empty state: active when `isEmpty` is true and `emptyMessage` is provided, and there is no error.
 *
 * @param props Component props.
 * @param components Injected framework-specific components.
 * @return JSX element or null when no state is active.
 */
export const ComboboxState = (props: ComboboxStateProps, { GenericBlock, Text }: ComboboxStateComponents) => {
    const { emptyMessage, errorMessage, errorTryReloadMessage, loadingMessage, state } = props;
    const showError = !!errorMessage;
    const resolvedEmptyMessage =
        typeof emptyMessage === 'function' ? emptyMessage(state?.inputValue || '') : emptyMessage;
    // Suppress empty while loading (immediate flag prevents false "no results" before data arrives)
    const showEmpty = state?.isEmpty && !showError && !state?.isLoading && !!resolvedEmptyMessage;
    // Show loading message when provided and not in error state.
    // The framework wrapper gates `loadingMessage` via the debounced `loadingAnnouncement` event,
    // passing `undefined` until the 500ms threshold is reached.
    const showLoading = !showError && !!loadingMessage;
    const show = showEmpty || showError;
    const alignProps = { hAlign: 'center', vAlign: 'center' };

    return (
        <GenericBlock
            className={classNames.join(!show && classNames.visuallyHidden(), block(), classNames.padding('regular'))}
            orientation="vertical"
            {...alignProps}
            role="status"
            aria-live="polite"
            aria-atomic
        >
            {showEmpty && (
                <Text as="p" typography="body1" color="dark-L2">
                    {resolvedEmptyMessage}
                </Text>
            )}
            {showLoading && (
                <Text as="p" typography="body1" color="dark-L2">
                    {loadingMessage}
                </Text>
            )}
            {!!errorMessage && (
                <>
                    <Text as="p" typography="subtitle2">
                        {errorMessage}
                    </Text>
                    {errorTryReloadMessage && (
                        <Text as="p" typography="body1" color="dark-L2">
                            {errorTryReloadMessage}
                        </Text>
                    )}
                </>
            )}
        </GenericBlock>
    );
};
