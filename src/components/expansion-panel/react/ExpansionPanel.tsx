import React, { PropsWithChildren, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { Button, ButtonEmphasis, ButtonVariant, ColorPalette, DragHandle, Theme } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { Callback, IGenericProps, getRootClassName, isComponent, partitionMulti } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { castArray, get, isEmpty } from 'lodash';

/////////////////////////////

const enum ExpansionPanelVariant {
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
    toggleCallback?: Callback;
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
    variant: ExpansionPanelVariant.boxed,
};

const isDragHandle = isComponent(DragHandle);
const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/////////////////////////////

const ExpansionPanel: React.FC<ExpansionPanelProps> = (props: ExpansionPanelProps): ReactElement => {
    const {
        label,
        theme,
        variant = DEFAULT_PROPS.variant,
        isOpen,
        className,
        openCallback,
        closeCallback,
        toggleCallback,
        ...otherProps
    } = props;

    const children: ReactNode[] = castArray(props.children);

    // partition children by types
    const [[dragHandle], [header], [footer], content] = partitionMulti(children, [isDragHandle, isHeader, isFooter]);

    // Either take the header in children or create one with the label
    const headerProps: PropsWithChildren<{}> = React.isValidElement(header) ? header.props : {};
    const headerContent = !isEmpty(headerProps.children) ? (
        headerProps.children
    ) : (
        <span className={`${CLASSNAME}__label`}>{label}</span>
    );

    const [showWrapper, setShowWrapper] = useState(isOpen);
    useEffect(() => {
        if (isOpen !== undefined) {
            setShowWrapper(isOpen);
        }
    }, [isOpen]);

    const toggleOpen = (): void => {
        const shouldOpen = !showWrapper;
        if (openCallback && shouldOpen) {
            openCallback();
        }
        if (closeCallback && !shouldOpen) {
            closeCallback();
        }
        if (toggleCallback) {
            toggleCallback();
        }
        setShowWrapper(shouldOpen);
    };

    const color = theme === Theme.light ? ColorPalette.dark : ColorPalette.light;

    const rootClassName = classNames(
        className,
        // Background color
        variant === ExpansionPanelVariant.boxed && `lumx-theme-background-${color}-L6`,
        // Text color
        theme === Theme.dark && 'lumx-theme-color-light-N',
        theme === Theme.light && 'lumx-theme-color-dark-N',
        // Others
        handleBasicClasses({
            isDraggable: !!dragHandle,
            prefix: CLASSNAME,
            theme,
            variant,
        }),
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const isContentVisible = (): boolean => get(wrapperRef, 'current.clientHeight') > 0;

    // Switch max height on/off to activate the CSS transition
    const [maxHeight, setMaxHeight] = useState('0');
    useEffect(() => {
        if (showWrapper && wrapperRef.current) {
            setMaxHeight(wrapperRef.current.offsetHeight + 'px');
        } else {
            setMaxHeight('0');
        }
    }, [showWrapper, wrapperRef.current]);

    return (
        <section className={rootClassName} {...otherProps}>
            <header className={`${CLASSNAME}__header`} onClick={toggleOpen}>
                {dragHandle && <div className={`${CLASSNAME}__header-drag`}>{dragHandle}</div>}

                <div className={`${CLASSNAME}__header-content`} {...headerProps}>
                    {headerContent}
                </div>

                <div className={`${CLASSNAME}__header-toggle`}>
                    <Button
                        color={color}
                        emphasis={ButtonEmphasis.low}
                        variant={ButtonVariant.icon}
                        leftIcon={showWrapper ? mdiChevronUp : mdiChevronDown}
                    />
                </div>
            </header>

            {(showWrapper || isContentVisible()) && (
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
