/** Map of menu event names to their payload types. */
export interface MenuEventMap {
    /** Fired when the menu open state changes. Payload: whether the menu is open. */
    open: boolean;
}

/**
 * Handle returned by `setupMenu`. Used by framework wrappers to plug DOM elements
 * into the menu state machine.
 */
export interface MenuHandle {
    /** The trigger element, registered via `registerTrigger`. Null before registration. */
    readonly trigger: HTMLElement | null;

    /** Set the open state, update ARIA, fire `open` event. */
    setOpen(open: boolean): void;

    /**
     * Register the trigger element. Wires click toggle, keyboard handlers (ArrowUp/Down
     * to open with focus, trigger typeahead) and ARIA attributes. Returns a cleanup fn.
     */
    registerTrigger(el: HTMLElement): () => void;

    /**
     * Register the menu container (`<ul>`). Wires keyboard handlers (arrow nav, typeahead,
     * Tab-edge close, Escape). Always mounted (`closeMode="hide"`), so runs once.
     * Returns a cleanup fn.
     */
    registerMenu(el: HTMLElement): () => void;

    /**
     * Apply a focus request deferred while the menu was closed (trigger ArrowDown/Up,
     * typeahead, or click-open). The wrapper must call this once items commit to the DOM.
     */
    flushPendingNavigation(): void;

    /** Subscribe to a menu event. Returns an unsubscribe function. */
    subscribe<E extends keyof MenuEventMap>(event: E, listener: (value: MenuEventMap[E]) => void): () => void;

    /** Tear down — removes all event listeners and clears state. */
    destroy(): void;
}

/** Options for `setupMenu`. The wrapper sets the matching `id` on the `<ul>` itself. */
export interface SetupMenuOptions {
    /** The id to advertise via `aria-controls` on the trigger. */
    menuId?: string;
}
