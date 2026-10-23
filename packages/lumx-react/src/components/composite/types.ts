import type { ElementType } from 'react';
import type { HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';

/**
 * Props forwarded to the action element (button or link) of a composite item (`Combobox.Option`, `TreeListItem`).
 */
export type CompositeItemActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> & HasRequiredLinkHref<E>;
