import type { CommonRef, HasClassName, JSXElement, LumxClassName, GenericProps } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';

export interface BaseDialogProps {
    /** Footer content. */
    footer?: JSXElement;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceFooterDivider?: boolean;
    /** Header content. */
    header?: JSXElement;
    /** Whether the divider between the dialog content and the header is always displayed (instead of showing it on scroll). */
    forceHeaderDivider?: boolean;
    /** Whether the indefinite progress indicator over the dialog content is displayed or not. */
    isLoading?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
}

/**
 * Defines the props of the component.
 */
export interface DialogProps extends HasClassName, BaseDialogProps {
    /** Reference to the root element. */
    ref?: CommonRef;
    /** Whether the component is still visible (e.g. during close animation). */
    isVisible?: boolean;
    /** Reference to the dialog content element. */
    contentRef?: CommonRef;
    /** Size variant. */
    size?: DialogSizes;
    /** Z-axis position. */
    zIndex?: number;
    /** Additional props for the dialog container element. */
    dialogProps?: GenericProps;
    /** On close callback. */
    handleClose?(): void;
    /** Whether to prevent closing on click away. */
    shouldPreventCloseOnClickAway?: boolean;
    /** Refs used for click-away detection. */
    clickAwayRefs?: any;
    /** Ref for the root wrapper element. */
    rootRef?: CommonRef;
    /** Ref for the inner section element. */
    wrapperRef?: CommonRef;
    /** Whether the header sentinel is out of view (controls header divider). */
    hasTopIntersection: boolean | null;
    /** Whether the footer sentinel is out of view (controls footer divider). */
    hasBottomIntersection: boolean | null;
    /** Props forwarded from a child <header> element. */
    headerChildProps?: GenericProps;
    /** Content extracted from a child <header> element. */
    headerChildContent?: JSXElement;
    /** Props forwarded from a child <footer> element. */
    footerChildProps?: GenericProps;
    /** Content extracted from a child <footer> element. */
    footerChildContent?: JSXElement;
    /** Dialog body content. */
    content?: JSXElement;
    /** Ref setter for the top scroll sentinel element. */
    setSentinelTop?: any;
    /** Ref setter for the bottom scroll sentinel element. */
    setSentinelBottom?: any;
    /** Portal component for rendering outside the DOM hierarchy. */
    Portal: any;
    /** HeadingLevelProvider component. */
    HeadingLevelProvider: any;
    /** ThemeProvider component. */
    ThemeProvider: any;
    /** ClickAwayProvider component. */
    ClickAwayProvider: any;
    /** ProgressCircular component */
    ProgressCircular: any;
}

export type DialogSizes = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Dialog';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-dialog';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<DialogProps> = {
    size: Size.big,
};

/**
 * Dialog component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Dialog = (props: DialogProps) => {
    const {
        className,
        ref,
        header,
        forceFooterDivider,
        forceHeaderDivider,
        footer,
        isLoading,
        isOpen,
        handleClose,
        contentRef,
        size = DEFAULT_PROPS.size,
        zIndex,
        dialogProps,
        headerChildContent,
        isVisible,
        Portal,
        HeadingLevelProvider,
        ThemeProvider,
        ClickAwayProvider,
        shouldPreventCloseOnClickAway,
        clickAwayRefs,
        rootRef,
        wrapperRef,
        hasTopIntersection,
        headerChildProps,
        setSentinelTop,
        content,
        setSentinelBottom,
        footerChildContent,
        footerChildProps,
        ProgressCircular,
        hasBottomIntersection,
        ...forwardedProps
    } = props;

    return (
        <Portal>
            <div
                ref={ref}
                {...forwardedProps}
                className={classNames.join(
                    className,
                    block({
                        'is-hidden': !isOpen,
                        'is-loading': isLoading,
                        'is-shown': isOpen || isVisible,
                        [`size-${size}`]: Boolean(size),
                    }),
                )}
                style={{ zIndex }}
            >
                <div className={element('overlay')} />

                <HeadingLevelProvider level={2}>
                    <ThemeProvider value={undefined}>
                        <div className={element('container')} role="dialog" aria-modal="true" {...dialogProps}>
                            <ClickAwayProvider
                                callback={!shouldPreventCloseOnClickAway && handleClose}
                                childrenRefs={clickAwayRefs}
                                parentRef={rootRef}
                            >
                                <section className={element('wrapper')} ref={wrapperRef}>
                                    {(header || headerChildContent) && (
                                        <header
                                            {...headerChildProps}
                                            className={classNames.join(
                                                element('header', {
                                                    'has-divider': Boolean(forceHeaderDivider || hasTopIntersection),
                                                }),
                                                headerChildProps?.className,
                                            )}
                                        >
                                            {header}
                                            {headerChildContent}
                                        </header>
                                    )}

                                    <div ref={contentRef} className={element('content')}>
                                        <div className={element('sentinel', { top: true })} ref={setSentinelTop} />

                                        {content}

                                        <div
                                            className={element('sentinel', { bottom: true })}
                                            ref={setSentinelBottom}
                                        />
                                    </div>

                                    {(footer || footerChildContent) && (
                                        <footer
                                            {...footerChildProps}
                                            className={classNames.join(
                                                element('footer', {
                                                    'has-divider': Boolean(forceFooterDivider || hasBottomIntersection),
                                                }),
                                                footerChildProps?.className,
                                            )}
                                        >
                                            {footer}
                                            {footerChildContent}
                                        </footer>
                                    )}

                                    {isLoading && (
                                        <div className={element('progress-overlay')}>
                                            <ProgressCircular />
                                        </div>
                                    )}
                                </section>
                            </ClickAwayProvider>
                        </div>
                    </ThemeProvider>
                </HeadingLevelProvider>
            </div>
        </Portal>
    );
};
