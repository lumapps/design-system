import React, { Children, PropsWithChildren, ReactNode, useRef } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import { ColorPalette, DragHandle, Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { GenericProps, HasCloseMode, HasTheme, isComponent } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { IS_BROWSER } from '@lumx/react/constants';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ExpansionPanelProps extends GenericProps, HasCloseMode, HasTheme {
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-expansion-panel';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ExpansionPanelProps> = {
    closeMode: 'unmount',
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
export const ExpansionPanel = forwardRef<ExpansionPanelProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        className,
        closeMode = DEFAULT_PROPS.closeMode,
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
    const { block, element } = useClassnames(CLASSNAME);

    const children: ReactNode[] = Children.toArray(anyChildren);

    // Partition children by types.
    const [[dragHandle], [header], [footer], content] = partitionMulti(children, [isDragHandle, isHeader, isFooter]);

    // Either take the header in children or create one with the label.
    const headerProps: PropsWithChildren<any> = React.isValidElement(header) ? header.props : {};
    const hasHeaderChildren = React.Children.count(headerProps.children) > 0;
    const headerContent = hasHeaderChildren ? headerProps.children : <span className={element('label')}>{label}</span>;

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

    const rootClassName = block(
        {
            'has-background': Boolean(hasBackground),
            'has-header': Boolean(hasHeaderChildren),
            'has-header-divider': Boolean(hasHeaderDivider),
            'is-close': Boolean(!isOpen),
            'is-draggable': Boolean(dragHandle),
            'is-open': Boolean(isOpen),
            [`theme-${theme}`]: Boolean(theme),
        },
        className,
    );

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Children stay visible while the open/close transition is running
    const [isChildrenVisible, setChildrenVisible] = React.useState(isOpen);

    const isOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
        if (isOpen || closeMode === 'hide') {
            setChildrenVisible(true);
        } else if (!IS_BROWSER) {
            // Outside a browser we can't wait for the transition
            setChildrenVisible(false);
        }
        isOpenRef.current = isOpen;
    }, [closeMode, isOpen]);

    // Change children's visibility on the transition end
    React.useEffect(() => {
        const { current: wrapper } = wrapperRef;
        if (!IS_BROWSER || !wrapper) {
            return undefined;
        }
        const onTransitionEnd = () => {
            setChildrenVisible(isOpenRef.current || closeMode === 'hide');
        };
        wrapper.addEventListener('transitionend', onTransitionEnd);
        return () => wrapper.removeEventListener('transitionend', onTransitionEnd);
    }, [closeMode]);

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
});
ExpansionPanel.displayName = COMPONENT_NAME;
ExpansionPanel.className = CLASSNAME;
ExpansionPanel.defaultProps = DEFAULT_PROPS;
