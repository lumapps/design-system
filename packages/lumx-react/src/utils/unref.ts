import { MaybeElementOrRef } from '@lumx/react/utils/type';

export function unref(maybeElement: MaybeElementOrRef<HTMLElement>) {
    if (maybeElement instanceof HTMLElement) return maybeElement;
    return maybeElement?.current;
}
