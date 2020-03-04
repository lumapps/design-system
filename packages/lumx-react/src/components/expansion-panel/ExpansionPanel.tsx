import React, { Children, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { ColorPalette, DragHandle, Emphasis, IconButton, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import {
    Callback,
    GenericProps,
    getRootClassName,
    handleBasicClasses,
    isComponent,
    partitionMulti,
} from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ExpansionPanelProps extends GenericProps {
    /** The color theme. */
    theme?: Theme;

    /** The label text used when no `<header>` was provided in the children. */
    label?: string;

    /** Whether the hexpansion panel has a background. */
    hasBackground?: boolean;

    /** Whether the header has a divider. */
    hasHeaderDivider?: boolean;

    /** Set panel open or not. */
    isOpen?: boolean;

    /** The function called on open. */
    openCallback?: Callback;

    /** The function called on close. */
    closeCallback?: Callback;

    /** The function called on open or close. */
    toggleCallback?(shouldOpen: boolean): void;
}

/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ExpansionPanel`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ExpansionPanelProps> = {
    theme: Theme.light,
};

const isDragHandle = isComponent(DragHandle);
const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/////////////////////////////

const ExpansionPanel: React.FC<ExpansionPanelProps> = (props) => {
    const {
        label,
        theme = DEFAULT_PROPS.theme,
        hasBackground,
        hasHeaderDivider,
        isOpen,
        className,
        openCallback,
        closeCallback,
        toggleCallback,
        ...otherProps
    } = props;

    const children: ReactNode[] = Children.toArray(props.children);

    // Partition children by types.
    const [[dragHandle], [header], [footer], content] = partitionMulti(children, [isDragHandle, isHeader, isFooter]);

    // Either take the header in children or create one with the label.
    const headerProps: PropsWithChildren<{}> = React.isValidElement(header) ? header.props : {};
    const headerContent = !isEmpty(headerProps.children) ? (
        headerProps.children
    ) : (
        <span className={`${CLASSNAME}__label`}>{label}</span>
    );

    const toggleOpen = () => {
        const shouldOpen = !isOpen;
        if (isFunction(openCallback) && shouldOpen) {
            openCallback();
        }
        if (isFunction(closeCallback) && !shouldOpen) {
            closeCallback();
        }
        if (isFunction(toggleCallback)) {
            toggleCallback(shouldOpen);
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
    }, [children, isOpen, wrapperRef.current]);

    return (
        <section className={rootClassName} {...otherProps}>
            <header className={`${CLASSNAME}__header`} onClick={toggleOpen}>
                {dragHandle && <div className={`${CLASSNAME}__header-drag`}>{dragHandle}</div>}

                <div className={`${CLASSNAME}__header-content`} {...headerProps}>
                    {headerContent}
                </div>

                <div className={`${CLASSNAME}__header-toggle`}>
                    <IconButton color={color} emphasis={Emphasis.low} icon={isOpen ? mdiChevronUp : mdiChevronDown} />
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
};
ExpansionPanel.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ExpansionPanel, ExpansionPanelProps };
