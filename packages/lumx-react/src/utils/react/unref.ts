import { MaybeElementOrRef } from '@lumx/react/utils/type';

/** Unref a react ref or element */
export function unref(maybeElement: MaybeElementOrRef<HTMLElement>) {
    if (maybeElement instanceof HTMLElement) return maybeElement;
    return maybeElement?.current;
}
