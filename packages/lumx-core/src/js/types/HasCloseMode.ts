export interface HasCloseMode {
    /**
     * Choose how the children are hidden when closed
     * ('hide' keeps the children in DOM but hide them, 'unmount' remove the children from the DOM).
     */
    closeMode?: 'hide' | 'unmount';
}
