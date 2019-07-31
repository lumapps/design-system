import React, { ReactElement } from 'react';

/////////////////////////////

/**
 * Defines the state of the component
 */
interface IState {
    error?: Error;
    hasError: boolean;
}

/////////////////////////////

/**
 * This component is in charge of catching any error and avoid to the whole application to crash.
 */
class ErrorBoundary extends React.Component<{}, IState> {
    /**
     * When an error occurred, save the error in the state so that we can display it in the fallback display.
     *
     * @param  error The error that occurred.
     * @return The new state of the component.
     */
    public static getDerivedStateFromError(error: Error): IState {
        return { error, hasError: true };
    }

    public state: IState = {
        error: undefined,
        hasError: false,
    };

    public componentDidCatch(): void {
        // Nothing to do here, the error is already logged in the console and in the fallback display.
    }

    public render(): ReactElement {
        const { error, hasError } = this.state;

        if (hasError) {
            return (
                <div className="main">
                    <h1 className="mb++">Something went wrong with this demo</h1>

                    {error && <pre style={{ color: 'red' }}>{error.toString()}</pre>}
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

/////////////////////////////

export { ErrorBoundary };
