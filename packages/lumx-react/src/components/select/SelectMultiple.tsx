import React, { ReactNode, RefObject, SyntheticEvent } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@lumx/icons';

import { Size } from '@lumx/react/components';
import { Chip } from '@lumx/react/components/chip/Chip';
import { ChipGroup } from '@lumx/react/components/chip/ChipGroup';
import { Icon } from '@lumx/react/components/icon/Icon';
import { InputLabel } from '@lumx/react/components/input-label/InputLabel';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { withSelectContext } from './WithSelectContext';
import { CoreSelectProps, SelectVariant } from './constants';

/** Defines the props of the component. */
interface SelectMultipleProps extends CoreSelectProps {
    /** The list of selected values. */
    value: string[];

    /** The function called to render a selected value when `isMultiple` is true. Default: Renders the value inside of a Chip */
    selectedChipRender?(
        choice: string,
        index: number,
        onClear?: (event: SyntheticEvent, choice: string) => void,
        isDisabled?: boolean,
        theme?: any,
    ): ReactNode | string;
}

/** Define the types of the default props. */
interface DefaultPropsType extends Partial<SelectMultipleProps> {}

/** The display name of the component. */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Select`;

/** The default class name and classes prefix for this component. */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/** The default value of props. */
const DEFAULT_PROPS: DefaultPropsType = {
    hasError: false,
    isOpen: false,
    isValid: false,
    selectedChipRender(choice, index, onClear, isDisabled?, theme?) {
        const onClick = (event: React.MouseEvent) => onClear && onClear(event, choice);
        return (
            <Chip
                key={index}
                after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
                theme={theme}
            >
                {choice}
            </Chip>
        );
    },
    selectedValueRender: (choice) => choice,
};

/**
 * Select Multiple component.
 *
 * @return The component.
 */
const SelectMultipleField: React.FC<SelectMultipleProps> = ({
    variant,
    label,
    value,
    isEmpty,
    isValid,
    hasError,
    onClear,
    onInputClick,
    theme,
    placeholder,
    handleKeyboardNav,
    targetUuid,
    anchorRef,
    isRequired,
    isDisabled,
    selectedChipRender = DEFAULT_PROPS.selectedChipRender,
    selectedValueRender = DEFAULT_PROPS.selectedValueRender,
}) => {
    return (
        <>
            {variant === SelectVariant.input && (
                <>
                    {label && (
                        <div className={`${CLASSNAME}__header`}>
                            <InputLabel
                                htmlFor={targetUuid}
                                className={`${CLASSNAME}__label`}
                                isRequired={isRequired}
                                theme={theme}
                            >
                                {label}
                            </InputLabel>
                        </div>
                    )}

                    <div
                        ref={anchorRef as RefObject<HTMLDivElement>}
                        id={targetUuid}
                        className={`${CLASSNAME}__wrapper`}
                        onClick={onInputClick}
                        onKeyDown={handleKeyboardNav}
                        tabIndex={0}
                    >
                        <div className={`${CLASSNAME}__chips`}>
                            {!isEmpty && (
                                <ChipGroup theme={theme}>
                                    {value.map((val: string, index: number) =>
                                        selectedChipRender!(val, index, onClear, isDisabled, theme),
                                    )}
                                </ChipGroup>
                            )}
                        </div>

                        {isEmpty && placeholder && (
                            <div
                                className={classNames([
                                    `${CLASSNAME}__input-native`,
                                    `${CLASSNAME}__input-native--placeholder`,
                                ])}
                            >
                                <span>{placeholder}</span>
                            </div>
                        )}

                        {(isValid || hasError) && (
                            <div className={`${CLASSNAME}__input-validity`}>
                                <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xxs} />
                            </div>
                        )}

                        <div className={`${CLASSNAME}__input-indicator`}>
                            <Icon icon={mdiMenuDown} size={Size.s} />
                        </div>
                    </div>
                </>
            )}

            {variant === SelectVariant.chip && (
                <Chip
                    id={targetUuid}
                    isSelected={!isEmpty}
                    after={<Icon icon={isEmpty ? mdiMenuDown : mdiCloseCircle} />}
                    onAfterClick={isEmpty ? onInputClick : onClear}
                    onClick={onInputClick}
                    chipRef={anchorRef as RefObject<HTMLAnchorElement>}
                    theme={theme}
                >
                    {isEmpty && <span>{label}</span>}

                    {!isEmpty && (
                        <span>
                            <span>{selectedValueRender!(value[0])}</span>

                            {value.length > 1 && <span>&nbsp;+{value.length - 1}</span>}
                        </span>
                    )}
                </Chip>
            )}
        </>
    );
};

const SelectMultiple = (props: any) =>
    withSelectContext(SelectMultipleField, {
        ...props,
        className: classNames(
            props.className,
            handleBasicClasses({
                hasMultiple: !props.isEmpty,
                prefix: CLASSNAME,
            }),
        ),
        isEmpty: props.value.length === 0,
        isMultiple: true,
    });

SelectMultiple.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, SelectMultiple, SelectMultipleProps, SelectVariant };
