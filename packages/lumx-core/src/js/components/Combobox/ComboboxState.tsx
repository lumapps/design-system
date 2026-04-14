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
     * Message callback to display the number of available options.
     * Called with the current visible option count and should return a human-readable string
     * (e.g. `(n) => \`${n} result(s) available\``).
     * Displayed when the combobox is open, not empty, not loading, and not in error.
     * When omitted, no option count message is shown.
     */
    nbOptionMessage?: (optionsLength: number) => string;
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
         * The number of currently visible options.
         * Driven by the framework wrapper via the combobox handle's `optionsChange` event.
         */
        optionsLength?: number;
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
        /**
         * Whether the combobox popover is open.
         * Used to gate live region content so screen readers announce messages
         * when the popover opens (content insertion triggers `aria-live` announcement).
         */
        isOpen?: boolean;
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
 * Renders empty/error/option-count state messages inside the combobox popover.
 * The block itself acts as a screen reader live region (`role="status" aria-live="polite"`).
 *
 * Activation rules:
 * - Error state: active when `errorMessage` is provided (presence-based).
 * - Empty state: active when `optionsLength` is 0 and `emptyMessage` is provided, and there is no error.
 * - Option count: active when `nbOptionMessage` is provided, the list is not empty, not loading, and not in error.
 *
 * @param props Component props.
 * @param components Injected framework-specific components.
 * @return JSX element or null when no state is active.
 */
export const ComboboxState = (props: ComboboxStateProps, { GenericBlock, Text }: ComboboxStateComponents) => {
    const { emptyMessage, nbOptionMessage, errorMessage, errorTryReloadMessage, loadingMessage, state } = props;
    const isOpen = state?.isOpen ?? true;
    const optionsLength = state?.optionsLength ?? 0;
    const isEmpty = optionsLength === 0;
    const showError = !!errorMessage;
    const resolvedEmptyMessage =
        typeof emptyMessage === 'function' ? emptyMessage(state?.inputValue || '') : emptyMessage;
    // Suppress empty while loading (immediate flag prevents false "no results" before data arrives)
    const showEmpty = isEmpty && !showError && !state?.isLoading && !!resolvedEmptyMessage;
    // Show loading message when provided and not in error state.
    // The framework wrapper gates `loadingMessage` via the debounced `loadingAnnouncement` event,
    // passing `undefined` until the 500ms threshold is reached.
    const showLoading = !showError && !!loadingMessage;
    // Show option count message when the list is open, not empty, not loading, and not in error.
    const resolvedNbOptionMessage =
        !isEmpty && !showError && !state?.isLoading && nbOptionMessage ? nbOptionMessage(optionsLength) : undefined;
    const show = showEmpty || showError;
    const alignProps = { hAlign: 'center', vAlign: 'center' };

    // Gate message content behind isOpen so that content is *inserted* into the
    // aria-live region when the popover opens, triggering screen reader announcements.
    // Without this gate, content is already present (just hidden via display:none from
    // the popover's closeMode="hide") and revealing it doesn't trigger announcements.
    const renderContent = isOpen;

    return (
        <GenericBlock
            className={classNames.join(!show && classNames.visuallyHidden(), block(), classNames.padding('regular'))}
            orientation="vertical"
            {...alignProps}
            role="status"
            aria-live="polite"
            aria-atomic
        >
            {renderContent && showEmpty && (
                <Text as="p" typography="body1" color="dark-L2">
                    {resolvedEmptyMessage}
                </Text>
            )}
            {renderContent && showLoading && (
                <Text as="p" typography="body1" color="dark-L2">
                    {loadingMessage}
                </Text>
            )}
            {renderContent && !!resolvedNbOptionMessage && (
                <Text as="p" typography="body1" color="dark-L2">
                    {resolvedNbOptionMessage}
                </Text>
            )}
            {renderContent && !!errorMessage && (
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
