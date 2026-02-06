import type React from 'react';

/**
 * Framework-agnostic type for renderable content.
 * Vue components should cast VNode[] from slots to this type.
 *
 * Note: Uses type-only import to avoid runtime dependencies.
 */
export type JSXElement = React.ReactNode;

export type ElementType = React.ElementType;
