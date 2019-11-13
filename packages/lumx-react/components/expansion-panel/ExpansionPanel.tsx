import React, { Children, PropsWithChildren, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { ColorPalette, DragHandle, Emphasis, IconButton, Theme } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { Callback, IGenericProps, getRootClassName, isComponent, partitionMulti } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { get, isEmpty, isFunction } from 'lodash';

/////////////////////////////

enum ExpansionPanelVariant {
    boxed = 'boxed',
    trimmed = 'trimmed',
}

/**
 * Defines the props of the component.
 */
interface IExpansionPanelProps extends IGenericProps {
    /** The color theme */
    theme?: Theme;

    /** The panel variant */
    variant?: ExpansionPanelVariant;

    /** The label text used when no `<header>` was provided in the children */
    label?: string;

    /** Set panel open or not */
    isOpen?: boolean;

    /** The function called on open */
    openCallback?: Callback;

    /** The function called on close */
    closeCallback?: Callback;

    /** The function called on open or close */
    toggleCallback?(shouldOpen: boolean): void;
}
type ExpansionPanelProps = IExpansionPanelProps;

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
    variant: ExpansionPanelVariant.boxed,
};

const isDragHandle = isComponent(DragHandle);
const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/////////////////////////////

const ExpansionPanel: React.FC<ExpansionPanelProps> = (props: ExpansionPanelProps): ReactElement => {
    const {
        label,
        theme = DEFAULT_PROPS.theme,
        variant = DEFAULT_PROPS.variant,
        isOpen,
        className,
        openCallback,
        closeCallback,
        toggleCallback,
        ...otherProps
    } = props;

    const children: ReactNode[] = Children.toArray(props.children);

    // partition children by types
    const [[dragHandle], [header], [footer], content] = partitionMulti(children, [isDragHandle, isHeader, isFooter]);

    // Either take the header in children or create one with the label
    const headerProps: PropsWithChildren<{}> = React.isValidElement(header) ? header.props : {};
    const headerContent = !isEmpty(headerProps.children) ? (
        headerProps.children
    ) : (
        <span className={`${CLASSNAME}__label`}>{label}</span>
    );

    const toggleOpen = (): void => {
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
        // Background color
        variant === ExpansionPanelVariant.boxed && `lumx-theme-background-${color}-L6`,
        // Text color
        theme === Theme.dark ? 'lumx-theme-color-light-N' : 'lumx-theme-color-dark-N',
        // Others
        handleBasicClasses({
            isDraggable: !!dragHandle,
            prefix: CLASSNAME,
            theme,
            variant,
        }),
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const isContentVisible = (): boolean => get(wrapperRef.current, 'clientHeight', 0) > 0;

    // Switch max height on/off to activate the CSS transition (updates when children changes).
    const [maxHeight, setMaxHeight] = useState('0');
    useEffect(() => {
        const height = isOpen ? get(wrapperRef.current, 'offsetHeight', 0) : 0;
        setMaxHeight(height + 'px');
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

export { CLASSNAME, DEFAULT_PROPS, ExpansionPanel, ExpansionPanelProps, ExpansionPanelVariant };
