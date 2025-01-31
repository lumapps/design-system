import type React from 'react';

/**
 * Maybe a HTMLElement or a React ref of a HTMLElement
 */
export type MaybeElementOrRef<E extends HTMLElement> = E | React.RefObject<E | null> | null | undefined;
