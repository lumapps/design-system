import { RefObject, useEffect } from 'react';

interface UseRovingTabIndexOptions {
    parentRef: RefObject<HTMLElement>;
    elementSelector: string;
    keepTabIndex?: boolean;
    /** List of values to be used as extra dependencies of the useEffect */
    extraDependencies?: any[];
}

export const useRovingTabIndex = ({
    parentRef,
    elementSelector,
    keepTabIndex,
    extraDependencies = [],
}: UseRovingTabIndexOptions): void => {
    useEffect(
        () => {
            const parent = parentRef?.current;
            if (!parent) {
                return undefined;
            }

            const elements = parent.querySelectorAll(elementSelector) as NodeListOf<HTMLElement>;
            const initialFocusableElement = parent?.querySelector(`${elementSelector}[tabindex="0"]`);

            const handleKeyDown = (index: number) => (evt: KeyboardEvent) => {
                let newTabFocus = index;
                if (!(evt.key === 'ArrowRight' || evt.key === 'ArrowLeft')) {
                    return;
                }

                if (evt.key === 'ArrowRight') {
                    // Move right
                    newTabFocus += 1;
                    // If we're at the end, go to the start
                    if (newTabFocus >= elements.length) {
                        newTabFocus = 0;
                    }
                } else if (evt.key === 'ArrowLeft') {
                    // Move left
                    newTabFocus -= 1;
                    if (newTabFocus < 0) {
                        // If we're at the start, move to the end
                        newTabFocus = elements.length - 1;
                    }
                }
                const newElement = elements[newTabFocus];
                newElement?.focus();
                if (keepTabIndex) {
                    (evt.currentTarget as HTMLElement).setAttribute('tabindex', '-1');
                    newElement?.setAttribute('tabindex', '0');
                }
            };

            if (elements?.length > 0) {
                elements.forEach((el, key) => {
                    // if no element has tabindex set to 0, set the first element as focusable
                    if (!initialFocusableElement && key === 0) {
                        el.setAttribute('tabindex', '0');
                        // set all other to -1
                    } else if (initialFocusableElement !== el) {
                        el.setAttribute('tabindex', '-1');
                    }
                    // add event listener
                    el.addEventListener('keydown', handleKeyDown(key) as EventListener);
                });
            }

            // Cleanup listeners
            return () => {
                if (elements?.length > 0) {
                    elements.forEach((el, key) => {
                        el.removeEventListener('keydown', handleKeyDown(key) as EventListener);
                    });
                }
            };
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [parentRef, ...extraDependencies],
    );
};
