import React, { Children, PropsWithChildren, ReactNode, useRef } from 'react';

import isEmpty from 'lodash/isEmpty';

import { DragHandle, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { GenericProps, isComponent } from '@lumx/react/utils/type';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { IS_BROWSER } from '@lumx/react/constants';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ExpansionPanel as UI,
    ExpansionPanelProps as UIProps,
    element,
    ExpansionPanelPropsToOverride,
} from '@lumx/core/js/components/ExpansionPanel';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface ExpansionPanelProps extends GenericProps, ReactToJSX<UIProps, ExpansionPanelPropsToOverride> {
    /** On open callback. */
    onOpen?: (event: React.MouseEvent) => void;
    /** On close callback. */
    onClose?: (event: React.MouseEvent) => void;
    /** Props to pass to the toggle button (minus those already set by the ExpansionPanel props). */
    toggleButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** On toggle open or close callback. */
    onToggleOpen?(shouldOpen: boolean, event: React.MouseEvent): void;
}

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
        closeMode = DEFAULT_PROPS.closeMode,
        children: anyChildren,
        isOpen,
        label,
        onClose,
        onOpen,
        onToggleOpen,
        theme = defaultTheme,
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
        <span className={element('label')}>{label}</span>
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

    return UI({
        content,
        dragHandle,
        footer,
        headerContent,
        ref,
        headerProps,
        wrapperRef,
        IconButton,
        isOpen,
        handleClose: onClose,
        handleToggleOpen: onToggleOpen,
        handleOpen: onOpen,
        theme,
        isChildrenVisible,
        children,
        closeMode,
        label,
        ...forwardedProps,
    });
});
ExpansionPanel.displayName = COMPONENT_NAME;
ExpansionPanel.className = CLASSNAME;
ExpansionPanel.defaultProps = DEFAULT_PROPS;
