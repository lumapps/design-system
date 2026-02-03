/**
 * A component reference that can be used in nested components.
 * This is framework-agnostic and works with both React components (functions)
 * and Vue components (objects/constructors).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentLike = any;

/**
 * Represents a mapping of nested component names to their component implementations.
 * Used to provide component references to LumX core components that accept nested components.
 *
 * This type is framework-agnostic and can accept both React and Vue component types.
 * While ComponentLike is typed as any, this structured type provides better documentation
 * and a centralized location for future refinements.
 *
 * @example
 * // React usage
 * Flag(props, { Text });
 *
 * @example
 * // Vue usage with VueToJSX
 * const ui = VueToJSX(FlagUI, { nestedComponents: { Text } });
 */
export type NestedComponents = Record<string, ComponentLike>;
