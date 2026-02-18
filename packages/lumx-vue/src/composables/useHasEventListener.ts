import { getCurrentInstance } from 'vue';

/**
 * Check if a specific event listener is attached to the current component instance.
 *
 * @param eventName - The event name to check (e.g., 'onClick', 'onKeyPress')
 * @returns true if the event listener exists, false otherwise
 */
export const useHasEventListener = (eventName: string): boolean => {
    const instance = getCurrentInstance();
    console.log({ eventName });
    console.log(instance?.vnode.props);
    return instance?.vnode.props?.[eventName] !== undefined;
};
