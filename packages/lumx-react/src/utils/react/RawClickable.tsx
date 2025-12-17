import { AriaAttributes, ElementType } from 'react';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { ComponentRef, HasPolymorphicAs } from '@lumx/react/utils/type';
import { HasRequiredLinkHref } from '@lumx/react/utils/type/HasRequiredLinkHref';

type ClickableElement = 'a' | 'button' | ElementType;

type BaseClickableProps<E extends ClickableElement> = {
    children?: React.ReactNode;
    isDisabled?: boolean;
    disabled?: boolean;
    'aria-disabled'?: AriaAttributes['aria-disabled'];
    onClick?: React.MouseEventHandler<E>;
};

export type RawClickableProps<E extends ClickableElement> = HasPolymorphicAs<E> &
    HasRequiredLinkHref<E> &
    BaseClickableProps<E>;

/**
 * Render clickable element (link, button or custom element)
 * (also does some basic disabled state handling)
 */
export const RawClickable = forwardRefPolymorphic(
    <E extends ClickableElement>(props: RawClickableProps<E>, ref: ComponentRef<E>) => {
        const {
            children,
            onClick,
            disabled,
            isDisabled = disabled,
            'aria-disabled': ariaDisabled,
            as,
            ...forwardedProps
        } = props;

        const isAnyDisabled = isDisabled || ariaDisabled === 'true' || ariaDisabled === true;

        const Component = as as any;
        let clickableProps;
        if (Component === 'button') {
            clickableProps = { type: forwardedProps.type || 'button', disabled: isDisabled };
        } else {
            clickableProps = { tabIndex: isDisabled ? '-1' : forwardedProps.tabIndex };
        }

        return (
            <Component
                ref={ref}
                aria-disabled={isAnyDisabled || undefined}
                {...forwardedProps}
                {...clickableProps}
                onClick={(event: any) => {
                    if (isAnyDisabled) {
                        event.stopPropagation();
                        event.preventDefault();
                        return;
                    }
                    onClick?.(event);
                }}
            >
                {children}
            </Component>
        );
    },
);
