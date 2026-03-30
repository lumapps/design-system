import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import isEmpty from 'lodash/isEmpty';

import { ColorPalette, Emphasis, Theme } from '../../constants';
import type {
    HasClassName,
    LumxClassName,
    HasCloseMode,
    HasTheme,
    CommonRef,
    GenericProps,
    JSXElement,
} from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface ExpansionPanelProps extends HasClassName, HasCloseMode, HasTheme {
    /** Whether the expansion panel has a background. */
    hasBackground?: boolean;
    /** Whether the header has a divider. */
    hasHeaderDivider?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Label text (overwritten if a `<header>` is provided in the children). */
    label?: string;
    /** On open callback. */
    handleOpen?: (event: any) => void;
    /** On close callback. */
    handleClose?: (event: any) => void;
    /** Props to pass to the toggle button (minus those already set by the ExpansionPanel props). */
    toggleButtonProps: any;
    /** On toggle open or close callback. */
    handleToggleOpen?(shouldOpen: boolean, event: any): void;
    /** Children */
    children?: JSXElement;
    /** Ref forwarded to the root `<section>` element. */
    ref?: CommonRef;
    /** Ref forwarded to the collapsible wrapper `<div>`. */
    wrapperRef?: CommonRef;
    /** Props spread onto the header content `<div>` (e.g. `aria-*`, `data-*`). */
    headerProps: GenericProps;
    /** Content rendered inside the header content area. */
    headerContent?: JSXElement;
    /** Optional drag handle element rendered at the start of the header. */
    dragHandle?: JSXElement;
    /** Content rendered inside the collapsible content area. */
    content?: JSXElement;
    /** Optional footer element rendered below the content. */
    footer?: JSXElement;
    /** IconButton component injected by the framework wrapper (React or Vue). */
    IconButton: any;
    /** Whether the children should remain mounted (visible in the DOM) while the panel is closed. */
    isChildrenVisible?: boolean;
}

export type ExpansionPanelPropsToOverride =
    | 'handleOpen'
    | 'handleClose'
    | 'toggleButtonProps'
    | 'handleToggleOpen'
    | 'wrapperRef'
    | 'headerProps'
    | 'headerContent'
    | 'dragHandle'
    | 'content'
    | 'IconButton'
    | 'isChildrenVisible'
    | 'footer';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ExpansionPanel';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-expansion-panel';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ExpansionPanelProps> = {
    closeMode: 'unmount',
};

/**
 * ExpansionPanel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ExpansionPanel = (props: ExpansionPanelProps) => {
    const {
        className,
        children: anyChildren,
        hasBackground,
        ref,
        hasHeaderDivider,
        isOpen,
        label,
        handleClose,
        handleOpen,
        handleToggleOpen,
        theme,
        toggleButtonProps,
        headerProps,
        headerContent,
        dragHandle,
        wrapperRef,
        content,
        isChildrenVisible,
        IconButton,
        footer,
        closeMode,
        ...forwardedProps
    } = props;

    const toggleOpen = (event: any) => {
        const shouldOpen = !isOpen;

        if (handleOpen && shouldOpen) {
            handleOpen(event);
        }
        if (handleClose && !shouldOpen) {
            handleClose(event);
        }
        if (handleToggleOpen) {
            handleToggleOpen(shouldOpen, event);
        }
    };

    const color = theme === Theme.dark ? ColorPalette.light : ColorPalette.dark;

    const rootClassName = classNames.join(
        className,
        block({
            'has-background': hasBackground,
            'has-header': Boolean(!isEmpty(headerProps.children)),
            'has-header-divider': hasHeaderDivider,
            'is-close': !isOpen,
            'is-draggable': Boolean(dragHandle),
            'is-open': isOpen,
            [`theme-${theme}`]: Boolean(theme),
        }),
    );

    return (
        <section ref={ref} {...forwardedProps} className={rootClassName}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <header className={element('header')} onClick={toggleOpen}>
                {dragHandle && <div className={element('header-drag')}>{dragHandle}</div>}

                <div {...headerProps} className={element('header-content')}>
                    {headerContent}
                </div>

                <div className={element('header-toggle')}>
                    <IconButton
                        {...toggleButtonProps}
                        color={color}
                        emphasis={Emphasis.low}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        aria-expanded={isOpen || 'false'}
                    />
                </div>
            </header>

            <div className={element('wrapper')} ref={wrapperRef}>
                {(isOpen || isChildrenVisible) && (
                    <div className={element('container')}>
                        <div className={element('content')}>{content}</div>

                        {footer && <div className={element('footer')}>{footer}</div>}
                    </div>
                )}
            </div>
        </section>
    );
};
