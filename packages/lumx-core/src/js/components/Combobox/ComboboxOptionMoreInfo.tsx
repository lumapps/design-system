import { mdiInformationOutline } from '@lumx/icons';

import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props for the core ComboboxOptionMoreInfo template.
 */
export interface ComboboxOptionMoreInfoProps extends HasClassName {
    /** Popover content (additional details about the option). */
    children?: JSXElement;
    /** Whether the popover is open. */
    isOpen?: boolean;
    /** ID for the popover element (used for aria-describedby on the parent option). */
    popoverId: string;
    /** Ref for the anchor element (icon button). */
    ref?: CommonRef;
    /** Mouse enter callback. */
    onMouseEnter?(): void;
    /** Mouse leave callback. */
    onMouseLeave?(): void;
    /** Props forwarded to the IconButton. */
    buttonProps?: Record<string, any>;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 */
export type ComboboxOptionMoreInfoPropsToOverride = 'children' | 'popoverId' | 'isOpen';

/**
 * Injected framework-specific components for ComboboxOptionMoreInfo rendering.
 */
export interface ComboboxOptionMoreInfoComponents {
    /** IconButton component (framework-specific). */
    IconButton: any;
    /** Popover component (framework-specific). */
    Popover: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxOptionMoreInfo';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-option-more-info';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * ComboboxOptionMoreInfo core template.
 * Renders an info icon button with a popover that shows additional details about a combobox option.
 * The popover opens on mouse hover or when the parent option is keyboard-highlighted.
 *
 * Framework-specific components (IconButton, Popover) are passed as a second argument
 * by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const ComboboxOptionMoreInfo = (
    props: ComboboxOptionMoreInfoProps,
    { IconButton, Popover }: ComboboxOptionMoreInfoComponents,
) => {
    const { children, className, isOpen, popoverId, ref, onMouseEnter, onMouseLeave, buttonProps } = props;

    return (
        <>
            <IconButton
                ref={ref}
                className={block([className])}
                icon={mdiInformationOutline}
                size="s"
                emphasis="low"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                // Button plays no interactive role — only serves as a hover target and popover anchor.
                // Keyboard accessibility is handled via combobox keyboard highlighting.
                aria-hidden
                label=""
                {...buttonProps}
            />
            <Popover
                id={popoverId}
                className={element('popover')}
                anchorRef={ref}
                isOpen={isOpen}
                closeMode="unmount"
                closeOnEscape
                closeOnClickAway
                placement="bottom-end"
            >
                {children}
            </Popover>
        </>
    );
};
