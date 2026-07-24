import type { CommonRef, GenericProps, JSXElement } from '../../types';
import { classNames } from '../../utils';
import { resolveAccessibleNameProps } from '../../utils/aria/resolveAccessibleNameProps';
import { element } from './constants';
import type { BaseDialogProps } from './types';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'DialogContent';

/**
 * Props of the dialog content: the `role="dialog"` element (which carries `aria-labelledby`) and
 * everything inside it (header, body, footer). It is meant to be rendered by a framework component
 * that has resolved `labelId` from the ids registry.
 */
export interface DialogContentProps extends BaseDialogProps {
    /**
     * Id of the heading naming this dialog (read from the ids registry by the framework), applied as
     * `aria-labelledby`. Overridden by an explicit `aria-label`/`aria-labelledby` set via `dialogProps`.
     */
    labelId?: string;
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
    /** Reference to the dialog content element. */
    contentRef?: CommonRef;
    /** Props forwarded from a child <header> element. */
    headerChildProps?: GenericProps;
    /** Content extracted from a child <header> element. */
    headerChildContent?: JSXElement;
    /** Whether the header sentinel is out of view (controls header divider). */
    hasTopIntersection: boolean | null;
    /** Dialog body content. */
    content?: JSXElement;
    /** Ref setter for the top scroll sentinel element. */
    setSentinelTop?: any;
    /** Ref setter for the bottom scroll sentinel element. */
    setSentinelBottom?: any;
    /** Props forwarded from a child <footer> element. */
    footerChildProps?: GenericProps;
    /** Content extracted from a child <footer> element. */
    footerChildContent?: JSXElement;
    /** Whether the footer sentinel is out of view (controls footer divider). */
    hasBottomIntersection: boolean | null;
    /** ProgressCircular component. */
    ProgressCircular: any;
    /** ClickAwayProvider component. */
    ClickAwayProvider: any;
}

/**
 * Dialog content: the `role="dialog"` element + header/body/footer.
 *
 * @param  props Component props.
 * @return React element.
 */
export const DialogContent = (props: DialogContentProps) => {
    const {
        labelId,
        dialogProps,
        handleClose,
        shouldPreventCloseOnClickAway,
        clickAwayRefs,
        rootRef,
        wrapperRef,
        contentRef,
        header,
        headerChildProps,
        headerChildContent,
        forceHeaderDivider,
        hasTopIntersection,
        content,
        setSentinelTop,
        setSentinelBottom,
        footer,
        footerChildProps,
        footerChildContent,
        forceFooterDivider,
        hasBottomIntersection,
        isLoading,
        ProgressCircular,
        ClickAwayProvider,
    } = props;

    // Strip both out of `dialogProps` before spreading it: `resolveAccessibleNameProps` picks at most one, and
    // leaving the other in place would let it survive underneath the spread below.
    const {
        'aria-label': dialogAriaLabel,
        'aria-labelledby': dialogAriaLabelledBy,
        ...restDialogProps
    } = dialogProps ?? {};

    return (
        <div
            className={element('container')}
            role="dialog"
            aria-modal="true"
            {...restDialogProps}
            {...resolveAccessibleNameProps(dialogAriaLabel, dialogAriaLabelledBy || labelId)}
        >
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

                        <div className={element('sentinel', { bottom: true })} ref={setSentinelBottom} />
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
    );
};
