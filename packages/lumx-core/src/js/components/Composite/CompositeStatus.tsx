import type { HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import type { CompositeState } from './types';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'CompositeStatus';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-composite-status';
const { block } = classNames.bem(CLASSNAME);

/** Class names of the previous versions (`Combobox.State` was the listbox state), kept for compatibility. */
export const LEGACY_CLASSNAME = 'lumx-listbox-state lumx-combobox-state';

/**
 * Defines the props for the core CompositeStatus template.
 */
export interface CompositeStatusProps extends HasClassName {
    /**
     * Message to display when the composite has no visible items.
     * Can be a plain string or a function receiving the current input value (for dynamic messages).
     * When omitted, the empty state is not shown.
     */
    emptyMessage?: string | ((inputValue: string) => string);
    /**
     * Message callback to display the number of available items.
     * Called with the current visible item count and should return a human-readable string
     * (e.g. `(n) => \`${n} result(s) available\``).
     * Displayed when the composite is open, not empty, not loading, and not in error.
     * When omitted, no item count message is shown.
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
     * The live region state of the composite (the `stateChange` snapshot, see `CompositeState`).
     * Without it (no composite handle yet), nothing renders.
     */
    state?: CompositeState;
    /** Additional content rendered after the state message. */
    children?: JSXElement;
}

/**
 * Components injected by the framework wrapper (dependency injection).
 */
export interface CompositeStatusComponents {
    /**
     * GenericBlock component (framework-specific, e.g. React GenericBlock with FlexBox handling).
     */
    GenericBlock: any;
    /**
     * Text component (framework-specific, e.g. React Text or Vue Text).
     */
    Text: any;
}

/**
 * CompositeStatus core template: the live region of a composite (listbox, grid or tree).
 * Renders the empty, loading, error and item count messages (e.g. in the combobox popover).
 * The block itself acts as a screen reader live region (`role="status" aria-live="polite"`).
 *
 * Activation rules:
 * - Error state: active when `errorMessage` is provided (presence-based).
 * - Empty state: active when the item count (`optionsLength`) is 0 and `emptyMessage` is provided, and there is
 *   no error.
 * - Item count: active when `nbOptionMessage` is provided, the composite is not empty, not loading, not in error, and
 *   the count is not hidden (`isCountHidden`, e.g. a tree without a filter).
 *
 * @param props Component props.
 * @param components Injected framework-specific components.
 * @return JSX element or null when no state is active.
 */
export const CompositeStatus = (props: CompositeStatusProps, { GenericBlock, Text }: CompositeStatusComponents) => {
    const { emptyMessage, nbOptionMessage, errorMessage, errorTryReloadMessage, state, className, children } = props;
    const isOpen = state?.isOpenForAnnouncement ?? false;
    const optionsLength = state?.optionsLength ?? 0;
    const isEmpty = optionsLength === 0;
    const showError = !!errorMessage;
    const resolvedEmptyMessage =
        typeof emptyMessage === 'function' ? emptyMessage(state?.inputValue || '') : emptyMessage;
    // Suppress empty while loading (immediate flag prevents false "no results" before data arrives)
    const showEmpty = isEmpty && !showError && !state?.isLoading && !!resolvedEmptyMessage;
    // Show the loading message when provided, not in error state, and once the loading lasted long enough
    // to be announced (`isLoadingAnnounced`: 500ms after the skeletons mount).
    const loadingMessage = state?.isLoadingAnnounced ? props.loadingMessage : undefined;
    const showLoading = !showError && !!loadingMessage;
    // Show the item count message when the composite is open, not empty, not loading, not in error, and the
    // count is not hidden.
    const resolvedNbOptionMessage =
        !isEmpty && !showError && !state?.isLoading && !state?.isCountHidden && nbOptionMessage
            ? nbOptionMessage(optionsLength)
            : undefined;
    const show = showEmpty || showError;
    const alignProps = { hAlign: 'center', vAlign: 'center' };

    // Gate message content behind isOpen so that content is *inserted* into the
    // aria-live region when the popover opens, triggering screen reader announcements.
    // Without this gate, content is already present (just hidden via display:none from
    // the popover's closeMode="hide") and revealing it doesn't trigger announcements.
    const renderContent = isOpen;

    return (
        <GenericBlock
            className={classNames.join(
                className,
                !show && classNames.visuallyHidden(),
                block(),
                LEGACY_CLASSNAME,
                classNames.padding('regular'),
            )}
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
            {children}
        </GenericBlock>
    );
};
