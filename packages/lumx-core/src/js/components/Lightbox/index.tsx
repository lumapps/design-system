import { mdiClose } from '@lumx/icons';
import type { AriaAttributes, CommonRef, HasClassName, LumxClassName, HasTheme, JSXElement } from '../../types';
import { classNames } from '../../utils';

export interface BaseLightboxProps
    extends HasClassName,
        HasTheme,
        Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'> {
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** Z-axis position. */
    zIndex?: number;
}

/**
 * Defines the props of the component.
 */
export interface LightboxProps extends BaseLightboxProps {
    /**
     * @deprecated Use `aria-label` instead.
     */
    ariaLabel?: string;
    /**
     * @deprecated Use `aria-labelledby` instead.
     */
    ariaLabelledBy?: string;
    /** Props to pass to the close button (minus those already set by the Lightbox props). */
    closeButtonProps?: any;
    /** Whether the component is still visible (e.g. during the close transition). */
    isVisible?: boolean;
    /** Reference to the element that triggered modal opening to set focus on. */
    parentElement?: CommonRef;
    /** Reference to the element that should get the focus when the lightbox opens. By default, the close button or the lightbox itself will take focus. */
    focusElement?: CommonRef;
    /** On close callback. */
    handleClose?(): void;
    /** Children */
    children?: JSXElement;
    /** Reference to the lightbox root element. */
    ref?: CommonRef;
    /** Reference to the wrapper div containing the children. */
    childrenRef?: CommonRef;
    /** Refs used for click-away detection. */
    clickAwayRefs?: any;
    /** Reference to the close button element. */
    closeButtonRef?: CommonRef;
    /** Portal component for rendering the lightbox outside the DOM hierarchy. */
    Portal: any;
    /** HeadingLevelProvider component injected by the framework wrapper. */
    HeadingLevelProvider: any;
    /** ThemeProvider component injected by the framework wrapper. */
    ThemeProvider: any;
    /** ClickAwayProvider component injected by the framework wrapper. */
    ClickAwayProvider: any;
    /** IconButton component injected by the framework wrapper. */
    IconButton: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Lightbox';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-lightbox';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Lightbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Lightbox = (props: LightboxProps) => {
    const {
        'aria-labelledby': propAriaLabelledBy,
        ariaLabelledBy = propAriaLabelledBy,
        'aria-label': propAriaLabel,
        ariaLabel = propAriaLabel,
        children,
        className,
        closeButtonProps,
        isOpen,
        handleClose,
        parentElement,
        focusElement,
        preventAutoClose,
        theme,
        zIndex,
        isVisible,
        ref,
        Portal,
        HeadingLevelProvider,
        ThemeProvider,
        ClickAwayProvider,
        childrenRef,
        clickAwayRefs,
        closeButtonRef,
        IconButton,
        ...forwardedProps
    } = props;
    if (!isOpen && !isVisible) return null;

    return (
        <Portal>
            <div
                ref={ref}
                {...forwardedProps}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
                className={classNames.join(
                    className,
                    block({
                        'is-hidden': !isOpen,
                        'is-shown': isOpen || isVisible,
                        [`theme-${theme}`]: Boolean(theme),
                    }),
                )}
                style={{ zIndex }}
            >
                {closeButtonProps && (
                    <div className={element('close')}>
                        <IconButton
                            {...closeButtonProps}
                            ref={closeButtonRef}
                            emphasis="low"
                            hasBackground
                            icon={mdiClose}
                            theme="dark"
                            type="button"
                            onClick={handleClose}
                        />
                    </div>
                )}
                <HeadingLevelProvider level={2}>
                    <ThemeProvider value={undefined}>
                        <ClickAwayProvider callback={!preventAutoClose && handleClose} childrenRefs={clickAwayRefs}>
                            <div ref={childrenRef} className={element('wrapper')} role="presentation">
                                {children}
                            </div>
                        </ClickAwayProvider>
                    </ThemeProvider>
                </HeadingLevelProvider>
            </div>
        </Portal>
    );
};
