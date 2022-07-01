import noop from 'lodash/noop';
import { mdiClose } from '@lumx/icons';
import {
    AlertDialog,
    Button,
    Checkbox,
    DatePickerField,
    Emphasis,
    FlexBox,
    IconButton,
    List,
    ListItem,
    Select,
    Size,
    TextField,
    Theme,
    Toolbar,
} from '@lumx/react';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { select } from '@storybook/addon-knobs';
import React, { RefObject, useCallback, useRef, useState } from 'react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { Dialog, DialogSizes } from './Dialog';
import { loremIpsum } from '../../stories/knobs/lorem';
import { chromaticForceScreenSize } from '../../stories/chromaticForceScreenSize';

export default {
    title: 'LumX components/dialog/Dialog',
    parameters: {
        // Delay Chromatic snapshot to wait for dialog to open.
        chromatic: {
            pauseAnimationAtEnd: true,
            delay: DIALOG_TRANSITION_DURATION,
        },
    },
    // Force minimum chromatic screen size to make sure the dialog appears in view.
    decorators: [chromaticForceScreenSize],
};

const header = <header className="lumx-spacing-padding lumx-typography-title">Dialog header</header>;
const content = <div className="lumx-spacing-padding">{loremIpsum('short')}</div>;
const longContent = <div className="lumx-spacing-padding">{loremIpsum('long')}</div>;
const footer = <footer className="lumx-spacing-padding">Dialog footer</footer>;

function useOpenButton(theme: Theme, defaultState = true) {
    const buttonRef = useRef() as RefObject<HTMLButtonElement>;
    const [isOpen, setOpen] = useState(defaultState);
    const openDialog = useCallback(() => setOpen(true), []);
    const closeDialog = useCallback(() => setOpen(false), []);

    return {
        button: (
            <Button ref={buttonRef} onClick={openDialog} theme={theme}>
                Open dialog
            </Button>
        ),
        buttonRef,
        openDialog,
        closeDialog,
        isOpen,
    };
}

export const SimpleDialog = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef}>
                {content}
            </Dialog>
        </>
    );
};

export const PreventDialogAutoClose = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog preventAutoClose isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef}>
                {content}
                <footer>
                    <Toolbar
                        after={
                            <Button onClick={closeDialog} emphasis={Emphasis.low}>
                                Close
                            </Button>
                        }
                    />
                </footer>
            </Dialog>
        </>
    );
};

export const DialogWithAlertDialog = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    const { openDialog: openAlertDialog, closeDialog: closeAlertDialog, isOpen: isAlertDialogOpen } = useOpenButton(
        theme,
        false,
    );

    const handleSubmitDialog = () => {
        closeDialog();
        openAlertDialog();
    };

    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef}>
                {content}
                <footer>
                    <Toolbar
                        after={
                            <Button onClick={handleSubmitDialog} emphasis={Emphasis.low}>
                                Close
                            </Button>
                        }
                    />
                </footer>
            </Dialog>
            <AlertDialog
                isOpen={isAlertDialogOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
                title="Default (info)"
                confirmProps={{ onClick: closeAlertDialog, label: 'Confirm' }}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const Sizes = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    const sizes: DialogSizes[] = [Size.tiny, Size.regular, Size.big, Size.huge];
    return (
        <>
            {button}
            Use the knobs to change the dialog size!
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                size={select('Dialog size', sizes, Size.tiny)}
                parentElement={buttonRef}
            >
                {longContent}
            </Dialog>
        </>
    );
};

export const LoadingDialog = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} isLoading parentElement={buttonRef}>
                {content}
            </Dialog>
        </>
    );
};

export const DialogWithHeaderFooterProps = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                header="Header prop"
                footer="Footer prop"
                parentElement={buttonRef}
            >
                {content}
            </Dialog>
        </>
    );
};

export const DialogWithHeaderFooterChildren = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef}>
                {header}
                {content}
                {footer}
            </Dialog>
        </>
    );
};

export const DialogWithHeaderFooterPropsAndChildren = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                header=" Header prop"
                footer=" Footer prop"
                parentElement={buttonRef}
            >
                {header}
                {content}
                {footer}
            </Dialog>
        </>
    );
};

export const DialogWithHeaderFooterAndDivider = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                forceFooterDivider
                forceHeaderDivider
                parentElement={buttonRef}
            >
                {header}
                {content}
                {footer}
            </Dialog>
        </>
    );
};

export const ScrollableDialog = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} size={Size.regular} parentElement={buttonRef}>
                {longContent}
            </Dialog>
        </>
    );
};

export const WithAnimationCallbacks = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    const handleVisibiltyCallback = (isVisible: boolean) => {
        alert(isVisible ? 'OPEN' : 'CLOSE');
    };

    return (
        <>
            {button}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                size={Size.regular}
                parentElement={buttonRef}
                onVisibilityChange={handleVisibiltyCallback}
            >
                {content}
            </Dialog>
        </>
    );
};

export const ScrollableDialogWithHeaderAndFooter = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef}>
                {header}
                {longContent}
                {footer}
            </Dialog>
        </>
    );
};

/** Test dialog focus trap (focus is contained inside the dialog) with all kinds of focusable and non-focusable items */
export const DialogFocusTrap = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    const [textValue, setTextValue] = useState('value');
    const [checkboxValue, setCheckboxValue] = useState(false);
    const inputRef = useRef(null);

    const selectChoices = ['First item', 'Second item', 'Third item'];
    const [value, setValue] = React.useState<string>(selectChoices[0]);
    const [isSelectOpen, setSelectOpen] = useState(false);
    const toggleSelect = () => setSelectOpen(!isSelectOpen);
    const closeSelect = () => setSelectOpen(false);
    const selectItem = (item: any) => () => {
        closeSelect();
        setValue(item);
    };
    const [date, setDate] = useState<Date | undefined>(new Date('2020-05-18'));

    const datePickerDialogButtonRef = useRef<HTMLButtonElement>(null);
    const [isDatePickerDialogOpen, closeDatePickerDialog, openDatePickerDialog] = useBooleanState(false);

    return (
        <>
            {button}
            <Dialog isOpen={isOpen} onClose={closeDialog} parentElement={buttonRef} focusElement={inputRef}>
                <header>
                    <Toolbar
                        label={<span className="lumx-typography-title">Dialog header</span>}
                        after={
                            <IconButton label="Close" icon={mdiClose} onClick={closeDialog} emphasis={Emphasis.low} />
                        }
                    />
                </header>
                <div className="lumx-spacing-padding-horizontal-huge lumx-spacing-padding-bottom-huge">
                    <div className="lumx-spacing-margin-bottom-huge">
                        The text field should capture the focus on open and a focus trap should be in place.
                    </div>

                    <TextField
                        className="lumx-spacing-margin-bottom-huge"
                        inputRef={inputRef}
                        value={textValue}
                        onChange={setTextValue}
                        label="Text input"
                        maxLength={10}
                    />

                    <Checkbox
                        className="lumx-spacing-margin-bottom-huge"
                        isChecked={checkboxValue}
                        onChange={setCheckboxValue}
                        label="Checkbox input"
                    />

                    <FlexBox orientation="horizontal" hAlign="bottom" gap="regular">
                        <Button ref={datePickerDialogButtonRef} onClick={openDatePickerDialog}>
                            Open date picker
                        </Button>
                        <Dialog
                            isOpen={isDatePickerDialogOpen}
                            parentElement={datePickerDialogButtonRef}
                            onClose={closeDatePickerDialog}
                        >
                            <header>
                                <Toolbar
                                    label={<h1 className="lumx-typography-title">Date picker</h1>}
                                    after={
                                        <IconButton
                                            label="Close"
                                            icon={mdiClose}
                                            onClick={closeDatePickerDialog}
                                            emphasis={Emphasis.low}
                                        />
                                    }
                                />
                            </header>
                            <div className="lumx-spacing-padding">
                                <DatePickerField
                                    locale="fr"
                                    label="Start date"
                                    placeholder="Pick a date"
                                    theme={theme}
                                    onChange={setDate}
                                    value={date}
                                    nextButtonProps={{ label: 'Next month' }}
                                    previousButtonProps={{ label: 'Previous month' }}
                                />
                                <DatePickerField
                                    locale="fr"
                                    label="Start date"
                                    placeholder="Pick a date"
                                    theme={theme}
                                    onChange={noop}
                                    value={undefined}
                                    nextButtonProps={{ label: 'Next month' }}
                                    previousButtonProps={{ label: 'Previous month' }}
                                    defaultMonth={new Date('2020-05-18')}
                                />
                            </div>
                        </Dialog>

                        <Select
                            className="lumx-spacing-margin-left-huge"
                            isOpen={isSelectOpen}
                            value={value}
                            label="Select label"
                            onInputClick={toggleSelect}
                            onDropdownClose={closeSelect}
                        >
                            <List isClickable>
                                {selectChoices.map((choice) => (
                                    <ListItem
                                        key={choice}
                                        isSelected={value === choice}
                                        onItemSelected={selectItem(choice)}
                                        size={Size.tiny}
                                    >
                                        {choice}
                                    </ListItem>
                                ))}
                            </List>
                        </Select>

                        <Button isDisabled>Disabled button (focus ignored)</Button>
                    </FlexBox>

                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                    <div tabIndex={0}>Focus div</div>

                    <Button isDisabled={false}>Button explicitly not disabled (should focus)</Button>
                </div>
            </Dialog>
        </>
    );
};
