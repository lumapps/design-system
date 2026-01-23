import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { ComponentRef } from '@lumx/react/utils/type';
import { RawClickable as UI, RawClickableProps, ClickableElement } from '@lumx/core/js/components/RawClickable';

export type { RawClickableProps };
/**
 * Render clickable element (link, button or custom element)
 * (also does some basic disabled state handling)
 */
export const RawClickable = forwardRefPolymorphic(
    <E extends ClickableElement>(props: RawClickableProps<E>, ref: ComponentRef<E>) => {
        return UI({ ref, ...props });
    },
);
