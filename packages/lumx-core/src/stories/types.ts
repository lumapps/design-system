import type { CombinationsOptions } from './utils/combinations';

/** Storybook decorator function */
type Decorator = (story: any, context: any) => any;

/** Framework-specific decorators (injectable by React/Vue consumers) */
interface StoryDecorators {
    /** Decorator to wrap a story with a container element */
    withWrapper?: (props: Record<string, any>, as?: any) => Decorator;
    /** Decorator to render a story in a combinations matrix */
    withCombinations?: (options: CombinationsOptions) => Decorator;
    /** Decorator adding a themed background (light/dark) based on the `theme` arg */
    withThemedBackground?: () => Decorator;
    /** manages nested props */
    withNestedProps?: () => Decorator;
    /** Decorator wrapping story in a resizable box */
    withResizableBox?: (options?: Record<string, any>) => Decorator;
}

/** A partial Storybook story object (args, argTypes, render, decorators, etc.) */
type StoryOverride = Record<string, any>;

/** Base options shared by all setup functions. */
interface SetupStoriesBaseOptions {
    /** The component to create stories for */
    component: any;
    /** Base render */
    render?: any;
    /** Base args */
    args?: any;
}

/**
 * Generic options for setting up component stories.
 */
export type SetupStoriesOptions<
    TConfig extends {
        overrides?: string;
        decorators?: keyof StoryDecorators;
        components?: Record<string, any>;
        argsConverter?: (props: any) => any;
    } = Record<string, never>,
> = SetupStoriesBaseOptions &
    // Add overrides only when TConfig specifies story names
    (TConfig extends { overrides: infer O extends string }
        ? { overrides?: Partial<Record<O, StoryOverride>> }
        : unknown) &
    // Add decorators only when TConfig specifies required decorator names
    (TConfig extends { decorators: infer D extends keyof StoryDecorators }
        ? { decorators: Pick<Required<StoryDecorators>, D> & StoryDecorators }
        : unknown) &
    // Add components only when TConfig specifies a components type
    (TConfig extends { components: infer C } ? { components: C } : unknown) &
    // Add argsConverter only when TConfig specifies it
    (TConfig extends { argsConverter: infer A } ? { argsConverter: A } : unknown);
