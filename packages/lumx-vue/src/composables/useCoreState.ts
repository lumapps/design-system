import { shallowRef } from 'vue';

/** Options given to a core state factory (e.g. `createCalendarState`). */
export interface CoreStateOptions<P> {
    /** Read the latest props. */
    getProps(): P;
    /** Called when the state changes. */
    onUpdate(): void;
}

/**
 * Bridge a core state (framework-agnostic) to a Vue component: create the state, and make its `getView()` reactive
 * (a render that reads the view renders again on each state update). Call it in `setup`.
 *
 * @param  create   Core state factory.
 * @param  getProps Read the latest props.
 * @return The core state, with a reactive `getView()`.
 */
export function useCoreState<P, S extends { getView(): unknown }>(
    create: (options: CoreStateOptions<P>) => S,
    getProps: () => P,
): S {
    const version = shallowRef(0);
    const state = create({
        getProps,
        onUpdate: () => {
            version.value += 1;
        },
    });
    return {
        ...state,
        getView() {
            // Read the version: track the state updates.
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            version.value;
            return state.getView();
        },
    };
}
