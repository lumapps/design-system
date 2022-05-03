import React, { PropsWithChildren, ReactNode } from 'react';

/**
 * Defines the state of the component
 */
interface State {
    hasError: boolean;
}

/**
 * This component is in charge of catching any error and avoid to the whole application to crash.
 */
export class ErrorBoundary extends React.Component<PropsWithChildren<any>, State> {
    constructor(props: PropsWithChildren<any>) {
        super(props);
        this.state = {
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
        return { hasError: !!error };
    }

    render(): ReactNode {
        const { hasError } = this.state;

        if (hasError) {
            return (
                <>
                    <h1>Something went wrong</h1>
                    <p>An error occurred while loading this page, please retry later.</p>
                </>
            );
        }
        return this.props.children;
    }
}
