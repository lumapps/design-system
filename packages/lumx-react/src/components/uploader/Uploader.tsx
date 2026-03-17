import React, { MouseEventHandler } from 'react';

import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

import {
    Uploader as UI,
    UploaderProps as UIProps,
    UploaderPropsToOverride,
    UploaderVariant,
    DEFAULT_PROPS,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Uploader';
import type { UploaderSize } from '@lumx/core/js/components/Uploader';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export type { UploaderSize };
export { UploaderVariant };

interface ReactFileInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
    onChange?(files: File[], evt: React.ChangeEvent<HTMLInputElement>): void;
}

/**
 * Defines the props of the component.
 */
export interface UploaderProps extends GenericProps, ReactToJSX<UIProps, UploaderPropsToOverride> {
    /** On click callback. */
    onClick?: MouseEventHandler;
    /** Handle file selection with a native input file. */
    fileInputProps?: ReactFileInputProps;
}

/**
 * Uploader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Uploader = forwardRef<UploaderProps>((props, ref) => {
    const { disabledStateProps, otherProps, isAnyDisabled } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, fileInputProps, onClick, ...forwardedProps } = otherProps;

    const handleClick: React.MouseEventHandler = React.useCallback(
        (evt) => {
            if (isAnyDisabled) {
                evt.preventDefault();
            } else {
                onClick?.(evt);
            }
        },
        [isAnyDisabled, onClick],
    );

    const generatedInputId = useId();
    const inputId = fileInputProps?.id || generatedInputId;
    const [isDragHovering, unsetDragHovering, setDragHovering] = useBooleanState(false);
    const wrapper = fileInputProps
        ? ({ Component: 'label', props: { htmlFor: inputId } } as const)
        : ({ Component: 'button', props: { type: 'button', ...disabledStateProps } } as const);

    const onChange = React.useMemo(() => {
        if (isAnyDisabled || !fileInputProps?.onChange) return undefined;
        return (evt: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = evt.target.files;
            const files = fileList ? Array.from(fileList) : [];
            fileInputProps.onChange?.(files, evt);
        };
    }, [isAnyDisabled, fileInputProps]);

    return UI({
        Component: wrapper.Component,
        ref,
        inputId,
        handleClick,
        handleChange: onChange,
        isAnyDisabled,
        isDragHovering,
        theme,
        fileInputProps: fileInputProps
            ? {
                  ...fileInputProps,
                  ...disabledStateProps,
                  readOnly: isAnyDisabled,
                  onDragEnter: setDragHovering,
                  onDragLeave: unsetDragHovering,
                  onDrop: unsetDragHovering,
              }
            : undefined,
        ...wrapper.props,
        ...forwardedProps,
    });
});

Uploader.displayName = COMPONENT_NAME;
Uploader.className = CLASSNAME;
Uploader.defaultProps = DEFAULT_PROPS;
