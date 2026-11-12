import { useReducer, useRef, useState } from 'react';

/** Options given to a core state factory (e.g. `createCalendarState`). */
export interface CoreStateOptions<P> {
    /** Read the latest props. */
    getProps(): P;
    /** Called when the state changes. */
    onUpdate(): void;
}

/**
 * Bridge a core state (framework-agnostic) to a React component: create the state once, give it the latest props,
 * and render again on each state update. Read `state.getView()` on each render.
 *
 * @param  create Core state factory.
 * @param  props  Latest props, read by the state.
 * @return The core state.
 */
export function useCoreState<P, S>(create: (options: CoreStateOptions<P>) => S, props: P): S {
    const latestProps = useRef(props);
    latestProps.current = props;
    const [, forceUpdate] = useReducer((count: number) => count + 1, 0);
    const [state] = useState(() => create({ getProps: () => latestProps.current, onUpdate: forceUpdate }));
    return state;
}
