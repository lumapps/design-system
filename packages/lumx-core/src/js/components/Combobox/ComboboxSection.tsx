import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props for the core ComboboxSection template.
 */
export interface ComboboxSectionProps extends HasClassName {
    /** Section label displayed as the group title. */
    label?: string;
    /** Section icon */
    icon?: string;
    /** Section content (should be ComboboxOption elements). */
    children: JSXElement;
    /** ref to the root element. */
    ref?: CommonRef;
    /**
     * When true, the section renders as a bare `<li hidden>` wrapper, keeping children
     * mounted (so option registrations stay alive) but invisible to the user and screen readers.
     * Set automatically by the React/Vue wrapper when all child options are filtered out.
     */
    hidden?: boolean;
    /**
     * When true, the section is visually rendered (label + content) but hidden from assistive
     * technology. Used for skeleton-only sections: the visual skeleton provides feedback to
     * sighted users, while the live region (`ComboboxState`) handles the loading announcement.
     */
    'aria-hidden'?: boolean;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 * Used by `ReactToJSX<ComboboxSectionProps, ComboboxSectionPropsToOverride>`.
 */
export type ComboboxSectionPropsToOverride = 'children';

/**
 * Injected framework-specific components for ComboboxSection rendering.
 */
export interface ComboboxSectionComponents {
    /** ListSection component (framework-specific). */
    ListSection: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxSection';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-section';

/**
 * ComboboxSection core template.
 * Renders a ListSection with combobox-specific ARIA roles.
 *
 * Framework-specific components (ListSection) are passed as a second argument
 * by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const ComboboxSection = (props: ComboboxSectionProps, { ListSection }: ComboboxSectionComponents) => {
    const { children, className, hidden, 'aria-hidden': ariaHidden, ...forwardedProps } = props;
    return (
        <ListSection
            {...forwardedProps}
            hidden={hidden}
            aria-hidden={ariaHidden || undefined}
            className={!hidden ? classNames.join(className, CLASSNAME) : undefined}
            role={!ariaHidden ? 'none' : undefined}
            itemsWrapperProps={{ role: 'group' }}
        >
            {children}
        </ListSection>
    );
};
