import { MaybeElementOrRef } from '@lumx/react/utils/type';

/** Unref a react ref or element */
export function unref(maybeElement: MaybeElementOrRef<Element>) {
    if (maybeElement instanceof Element) return maybeElement;
    return maybeElement?.current;
}
