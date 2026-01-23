export type HasRequiredLinkHref<E> = E extends 'a' ? { href: string } : Record<string, unknown>;
