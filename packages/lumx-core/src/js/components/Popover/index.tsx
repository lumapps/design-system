import type { JSXElement, HasTheme, HasClassName, CommonRef, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { Elevation, FitAnchorWidth, Offset, Placement, POPOVER_ZINDEX } from './constants';

/**
 * Shared popover props used by both React and Vue wrappers.
 *
 * Framework-specific props (ref types, children, callbacks) are added by each wrapper.
 * The `anchorRef`, `boundaryRef`, `focusElement`, `parentElement`, `focusTrapZoneElement`
 * are typed as `any` here because React uses `RefObject<HTMLElement>` while Vue uses
 * raw `HTMLElement` — each framework narrows the type in its own props definition.
 */
export interface PopoverProps extends HasClassName, HasTheme {
    /** Reference to the DOM element used to set the position of the popover. */
    anchorRef?: CommonRef;
    /** Customize the root element tag. */
    as?: string;
    /** Element which will act as boundary when opening the popover. */
    boundaryRef?: CommonRef;
    /** Whether a click anywhere out of the popover would close it. */
    closeOnClickAway?: boolean;
    /** Whether an escape key press would close the popover. */
    closeOnEscape?: boolean;
    /** Shadow elevation. */
    elevation?: Elevation;
    /**
     * Manage popover width:
     *   - `maxWidth`: popover not bigger than anchor
     *   - `minWidth` or `true`: popover not smaller than anchor
     *   - `width`: popover equal to the anchor.
     */
    fitToAnchorWidth?: FitAnchorWidth | boolean;
    /** Shrink popover if even after flipping there is not enough space. */
    fitWithinViewportHeight?: boolean;
    /** Element to focus when opening the popover. */
    focusElement?: CommonRef;
    /** Whether the focus should go back on the anchor when popover closes and focus is within. */
    focusAnchorOnClose?: boolean;
    /** Whether we put an arrow or not. */
    hasArrow?: boolean;
    /** Whether the popover is open or not. */
    isOpen: boolean;
    /** Offset placement relative to anchor. */
    offset?: Offset;
    /** Reference to the parent element that triggered the popover. */
    parentElement?: CommonRef;
    /** Placement relative to anchor. */
    placement?: Placement;
    /** Whether the popover should be rendered into a portal. */
    usePortal?: boolean;
    /** The element in which the focus trap should be set. Default to popover. */
    focusTrapZoneElement?: CommonRef;
    /** Z-axis position. */
    zIndex?: number;
    /** Whether the popover should trap the focus within itself. */
    withFocusTrap?: boolean;
    /** On close callback (on click away or Escape pressed). Framework wrappers provide their own type. */
    handleClose?(): void;
}

/**
 * Internal UI rendering props for the core Popover component.
 * These are passed by the framework wrappers after processing the behavioral PopoverProps.
 */
export interface PopoverUIProps extends HasClassName, HasTheme {
    /** Customize the root element tag. */
    as?: string;
    /** Content. */
    children: JSXElement;
    /** Shadow elevation. */
    elevation?: Elevation;
    /** Whether we put an arrow or not. */
    hasArrow?: boolean;
    /** Whether the popover is open or not. */
    isOpen: boolean;
    /** Resolved position (from floating UI). */
    position?: Placement;
    /** Computed popover styles (from floating UI). */
    popoverStyle?: any;
    /** Computed arrow styles (from floating UI). */
    arrowStyle?: any;

    /** Ref for the popover root element. */
    ref?: CommonRef;
    /** Ref setter for the arrow element. */
    arrowRef?: CommonRef;
    /** Whether to render into a portal. */
    usePortal?: boolean;
    /** Click-away callback (when closeOnClickAway is true). */
    clickAwayCallback?: any;
    /** Refs for click-away detection. */
    clickAwayRefs?: any;
    /** Unmount sentinel (React-specific, optional). */
    unmountSentinel?: JSXElement;
}

/** Injected framework-specific components. */
export interface PopoverComponents {
    /** Portal component for rendering outside the parent hierarchy. */
    Portal: any;
    /** ClickAwayProvider component for click-away detection. */
    ClickAwayProvider: any;
    /** ThemeProvider component for theme context isolation. */
    ThemeProvider: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Popover';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-popover';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props (used by framework wrappers).
 */
export const DEFAULT_PROPS: Partial<PopoverProps> = {
    elevation: 3 as Elevation,
    placement: Placement.AUTO,
    focusAnchorOnClose: true,
    usePortal: true,
    zIndex: POPOVER_ZINDEX,
};

/**
 * Popover core UI component.
 *
 * Framework-specific components (Portal, ClickAwayProvider, ThemeProvider) are passed
 * as a second argument by the React/Vue wrappers.
 */
export const Popover = (props: PopoverUIProps, { Portal, ClickAwayProvider, ThemeProvider }: PopoverComponents) => {
    const {
        as: asTag = 'div',
        children,
        className,
        elevation = DEFAULT_PROPS.elevation,
        hasArrow,
        isOpen,
        position,
        popoverStyle,
        arrowStyle,
        theme,

        // Framework-specific
        ref,
        arrowRef,
        usePortal = DEFAULT_PROPS.usePortal,
        clickAwayCallback,
        clickAwayRefs,
        unmountSentinel,

        // Forwarded props
        ...forwardedProps
    } = props;

    // Cast to `any` to avoid "union type too complex" error when using a dynamic tag name in JSX.
    // This is safe because `asTag` is always a valid HTML element tag (e.g. 'div').
    const Component = asTag as any;
    const adjustedElevation = Math.min(elevation || 0, 5);

    if (!isOpen) return null;

    return (
        <Portal enabled={usePortal}>
            <Component
                {...forwardedProps}
                ref={ref}
                className={classNames.join(
                    className,
                    block({
                        [`theme-${theme}`]: Boolean(theme),
                        [`elevation-${adjustedElevation}`]: Boolean(adjustedElevation),
                        [`position-${position}`]: Boolean(position),
                    }),
                )}
                style={popoverStyle}
                data-popper-placement={position}
            >
                {unmountSentinel}
                <ClickAwayProvider callback={clickAwayCallback} childrenRefs={clickAwayRefs}>
                    {hasArrow && (
                        <div ref={arrowRef} className={element('arrow')} style={arrowStyle}>
                            <svg viewBox="0 0 14 14" aria-hidden>
                                <path d="M8 3.49C7.62 2.82 6.66 2.82 6.27 3.48L.04 14 14.04 14 8 3.49Z" />
                            </svg>
                        </div>
                    )}
                    <ThemeProvider value={theme}>{children}</ThemeProvider>
                </ClickAwayProvider>
            </Component>
        </Portal>
    );
};
