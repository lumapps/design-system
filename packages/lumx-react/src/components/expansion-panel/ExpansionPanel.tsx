import React, { Children, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { ColorPalette, DragHandle, Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { type GenericProps, type HasTheme, type ComponentClassName, isComponent } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { EXPANSION_PANEL_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ExpansionPanelProps extends GenericProps, HasTheme {
    /** Whether the expansion panel has a background. */
    hasBackground?: boolean;
    /** Whether the header has a divider. */
    hasHeaderDivider?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Label text (overwritten if a `<header>` is provided in the children). */
    label?: string;
    /** On open callback. */
    onOpen?: (event: React.MouseEvent) => void;
    /** On close callback. */
    onClose?: (event: React.MouseEvent) => void;
    /** Props to pass to the toggle button (minus those already set by the ExpansionPanel props). */
    toggleButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** On toggle open or close callback. */
    onToggleOpen?(shouldOpen: boolean, event: React.MouseEvent): void;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ExpansionPanel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-expansion-panel';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ExpansionPanelProps> = {};

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
export const ExpansionPanel = forwardRef<ExpansionPanelProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
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
        theme = defaultTheme,
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

    const toggleOpen = (event: React.MouseEvent) => {
        const shouldOpen = !isOpen;

        if (isFunction(onOpen) && shouldOpen) {
            onOpen(event);
        }
        if (isFunction(onClose) && !shouldOpen) {
            onClose(event);
        }
        if (isFunction(onToggleOpen)) {
            onToggleOpen(shouldOpen, event);
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

    /** Hide the children at the end of the transition */
    const isChildrenVisible = useTransitionVisibility(wrapperRef, !!isOpen, EXPANSION_PANEL_TRANSITION_DURATION);

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
                        aria-expanded={isOpen || 'false'}
                    />
                </div>
            </header>

            {(isOpen || isChildrenVisible) && (
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
