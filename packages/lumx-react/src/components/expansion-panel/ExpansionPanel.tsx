import React, { Children, forwardRef, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { ColorPalette, DragHandle, Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import {
    Callback,
    Comp,
    GenericProps,
    getRootClassName,
    handleBasicClasses,
    isComponent,
    partitionMulti,
} from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ExpansionPanelProps extends GenericProps {
    /** Whether the expansion panel has a background. */
    hasBackground?: boolean;
    /** Whether the header has a divider. */
    hasHeaderDivider?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Label text (overwritten if a `<header>` is provided in the children). */
    label?: string;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** On open callback. */
    onOpen?: Callback;
    /** On close callback. */
    onClose?: Callback;
    /** Props to pass to the toggle button (minus those already set by the ExpansionPanel props). */
    toggleButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** On toggle open or close callback. */
    onToggleOpen?(shouldOpen: boolean): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ExpansionPanel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ExpansionPanelProps> = {
    theme: Theme.light,
};

const isDragHandle = isComponent(DragHandle);
const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/**
 * ExpansionPanel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ExpansionPanel: Comp<ExpansionPanelProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        className,
        children: anyChildren,
        hasBackground,
        hasHeaderDivider,
        isOpen,
        label,
        onClose,
        onOpen,
        onToggleOpen,
        theme,
        toggleButtonProps,
        ...forwardedProps
    } = props;

    const children: ReactNode[] = Children.toArray(anyChildren);

    // Partition children by types.
    const [[dragHandle], [header], [footer], content] = partitionMulti(children, [isDragHandle, isHeader, isFooter]);

    // Either take the header in children or create one with the label.
    const headerProps: PropsWithChildren<any> = React.isValidElement(header) ? header.props : {};
    const headerContent = !isEmpty(headerProps.children) ? (
        headerProps.children
    ) : (
        <span className={`${CLASSNAME}__label`}>{label}</span>
    );

    const toggleOpen = () => {
        const shouldOpen = !isOpen;
        if (isFunction(onOpen) && shouldOpen) {
            onOpen();
        }
        if (isFunction(onClose) && !shouldOpen) {
            onClose();
        }
        if (isFunction(onToggleOpen)) {
            onToggleOpen(shouldOpen);
        }
    };

    const color = theme === Theme.dark ? ColorPalette.light : ColorPalette.dark;

    const rootClassName = classNames(
        className,
        handleBasicClasses({
            hasBackground,
            hasHeader: Boolean(!isEmpty(headerProps.children)),
            hasHeaderDivider,
            isClose: !isOpen,
            isDraggable: Boolean(dragHandle),
            isOpen,
            prefix: CLASSNAME,
            theme,
        }),
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const isContentVisible = (): boolean => get(wrapperRef.current, 'clientHeight', 0) > 0;

    // Switch max height on/off to activate the CSS transition (updates when children changes).
    const [maxHeight, setMaxHeight] = useState('0');
    useEffect(() => {
        const height = isOpen ? get(wrapperRef.current, 'offsetHeight', 0) : 0;
        setMaxHeight(`${height}px`);
    }, [children, isOpen]);

    return (
        <section ref={ref} {...forwardedProps} className={rootClassName}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <header className={`${CLASSNAME}__header`} onClick={toggleOpen}>
                {dragHandle && <div className={`${CLASSNAME}__header-drag`}>{dragHandle}</div>}

                <div {...headerProps} className={`${CLASSNAME}__header-content`}>
                    {headerContent}
                </div>

                <div className={`${CLASSNAME}__header-toggle`}>
                    <IconButton
                        {...toggleButtonProps}
                        color={color}
                        emphasis={Emphasis.low}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                    />
                </div>
            </header>

            {(isOpen || isContentVisible()) && (
                <div className={`${CLASSNAME}__wrapper`} style={{ maxHeight }}>
                    <div className={`${CLASSNAME}__container`} ref={wrapperRef}>
                        <div className={`${CLASSNAME}__content`}>{content}</div>

                        {footer && <div className={`${CLASSNAME}__footer`}>{footer}</div>}
                    </div>
                </div>
            )}
        </section>
    );
});
ExpansionPanel.displayName = COMPONENT_NAME;
ExpansionPanel.className = CLASSNAME;
ExpansionPanel.defaultProps = DEFAULT_PROPS;
