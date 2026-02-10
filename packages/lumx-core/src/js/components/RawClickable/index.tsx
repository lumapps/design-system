import { Booleanish } from '../../types/Booleanish';
import { CommonRef, HasPolymorphicAs, HasRequiredLinkHref, JSXElement, ElementType } from '../../types';

export type ClickableElement = 'a' | 'button' | ElementType;

export type BaseClickableProps = {
    children?: JSXElement;
    isDisabled?: boolean;
    disabled?: boolean;
    'aria-disabled'?: Booleanish;
    onClick?: (event?: any) => void;
    ref?: CommonRef;
};

export type RawClickableProps<E extends ClickableElement> = HasPolymorphicAs<E> &
    HasRequiredLinkHref<E> &
    BaseClickableProps;

/**
 * Render clickable element (link, button or custom element)
 * (also does some basic disabled state handling)
 */
export const RawClickable = <E extends ClickableElement>(props: RawClickableProps<E>) => {
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
};
