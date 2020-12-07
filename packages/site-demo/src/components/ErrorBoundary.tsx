import React from 'react';

/**
 * Defines the state of the component
 */
interface State {
    error?: Error;
    hasError: boolean;
}

/**
 * This component is in charge of catching any error and avoid to the whole application to crash.
 */
export class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: undefined,
            hasError: false,
        };
    }

    /**
     * When an error occurred, save the error in the state so that we can display it in the fallback display.
     *
     * @param  error The error that occurred.
     * @return The new state of the component.
     */
    public static getDerivedStateFromError(error: Error): State {
        return { error, hasError: true };
    }

    public render() {
        const { error, hasError } = this.state;

        if (hasError) {
            return (
                <>
                    <h1>Something went wrong with this page</h1>

                    {error && <pre style={{ color: 'red' }}>{error.toString()}</pre>}
                </>
            );
        }
        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}
