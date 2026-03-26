import type {
    CommonRef,
    HasClassName,
    HasPolymorphicAs,
    HasRequiredLinkHref,
    JSXElement,
    LumxClassName,
} from '../../types';
import { classNames } from '../../utils';
import { ClickableElement, RawClickable } from '../RawClickable';

/**
 * Defines the props for the core ComboboxOptionAction template.
 */
export type ComboboxOptionActionProps<E extends ClickableElement = 'button'> = HasPolymorphicAs<E> &
    HasClassName &
    HasRequiredLinkHref<E> & {
        /** Content of the action (icon, label, etc.). */
        children?: JSXElement;
        /** Unique ID for the action element. */
        id?: string;
        /** Whether the action is disabled. */
        isDisabled?: boolean;
        /** On click callback. */
        handleClick?(evt: any): void;
        /** ref to the root element. */
        ref?: CommonRef;
    };

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxOptionAction';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-option-action';

/**
 * ComboboxOptionAction core template.
 * Renders a secondary action button within a combobox option row (grid mode).
 * Each action renders as a `role="gridcell"` element, enabling 2D keyboard
 * navigation (ArrowLeft/Right to move between the option and its actions).
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ComboboxOptionAction = <E extends ClickableElement = 'button'>(props: ComboboxOptionActionProps<E>) => {
    const { children, className, as: Element = 'button', handleClick, ...forwardedProps } = props;

    return RawClickable({
        as: Element as any,
        ...forwardedProps,
        role: 'gridcell',
        className: classNames.join(className, CLASSNAME),
        handleClick,
        children,
    } as any);
};
