import React, { Children, PropsWithChildren, ReactNode, useRef } from 'react';

import classNames from 'classnames';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import isEmpty from 'lodash/isEmpty';

import { ColorPalette, DragHandle, Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { GenericProps, HasTheme, isComponent } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { IS_BROWSER } from '@lumx/react/constants';

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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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

        if (onOpen && shouldOpen) {
            onOpen(event);
        }
        if (onClose && !shouldOpen) {
            onClose(event);
        }
        if (onToggleOpen) {
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

    // Children visible while the open/close transition is running
    const [isChildrenVisible, setChildrenVisible] = React.useState(isOpen);

    const isOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
        if (isOpen) {
            setChildrenVisible(true);
        } else if (!IS_BROWSER) {
            // Outside a browser we can't wait for the transition
            setChildrenVisible(false);
        }
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Change children visibility on transition end
    React.useEffect(() => {
        const { current: wrapper } = wrapperRef;
        if (!IS_BROWSER || !wrapper) {
            return undefined;
        }
        const onTransitionEnd = () => {
            setChildrenVisible(isOpenRef.current);
        };
        wrapper.addEventListener('transitionend', onTransitionEnd);
        return () => wrapper.removeEventListener('transitionend', onTransitionEnd);
    }, []);

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

            <div className={`${CLASSNAME}__wrapper`} ref={wrapperRef}>
                {(isOpen || isChildrenVisible) && (
                    <div className={`${CLASSNAME}__container`}>
                        <div className={`${CLASSNAME}__content`}>{content}</div>

                        {footer && <div className={`${CLASSNAME}__footer`}>{footer}</div>}
                    </div>
                )}
            </div>
        </section>
    );
});
ExpansionPanel.displayName = COMPONENT_NAME;
ExpansionPanel.className = CLASSNAME;
ExpansionPanel.defaultProps = DEFAULT_PROPS;
