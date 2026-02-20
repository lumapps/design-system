// Extend CSSStyleDeclaration to support viewTransitionName for view transitions
interface CSSStyleDeclaration {
    viewTransitionName: string | null;
}

// Extend React HTMLAttributes to support the HTML popover API (not yet in stable @types/react)
declare namespace React {
    interface HTMLAttributes {
        popover?: '' | 'auto' | 'manual' | 'hint' | undefined;
    }
}
/**
 * List untypped modules here to declare them as explicit any.
 */
declare module 'test-data-bot';
declare module '*.jpg';
