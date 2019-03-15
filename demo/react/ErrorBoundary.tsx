import React, { Fragment } from 'react';

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
     * When an error occured, save the error in the state so that we can display it in the fallback display.
     *
     * @param  {Error}  error The error that occured.
     * @return {IState} The new state of the component.
     */
    public static getDerivedStateFromError(error: Error): IState {
        return { error, hasError: true };
    }

    public state = {
        error: undefined,
        hasError: false,
    };

    public componentDidCatch() {
        // Nothing to do here, the error is already logged in the console and in the fallback display.
    }

    public render(): JSX.Element {
        const { error, hasError }: IState = this.state;

        if (hasError) {
            return (
                <div className="main">
                    <h1 className="mb++">Something went wrong with this demo</h1>

                    <pre style={{ color: 'red' }}>{error!.toString()}</pre>
                </div>
            );
        }

        return <Fragment>{this.props.children}</Fragment>;
    }
}

/////////////////////////////

export { ErrorBoundary };
