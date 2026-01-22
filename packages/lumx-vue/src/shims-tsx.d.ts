import 'vue';

// This shim allows 'className' and 'htmlFor' to be used in JSX.
// This is necessary because lumx-vue imports components from lumx-core (which use React JSX with className/htmlFor),
// and the TypeScript compiler in this workspace is configured for Vue (which expects class/for).
// Without this, the build fails when processing lumx-core sources.

declare module 'vue' {
    interface HTMLAttributes {
        className?: string;
        htmlFor?: string;
    }

    interface LabelHTMLAttributes {
        htmlFor?: string;
    }
}
