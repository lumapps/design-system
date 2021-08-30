import { mdiClose } from '@lumx/icons';
import {
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
import { select } from '@storybook/addon-knobs';
import React, { RefObject, useRef, useState } from 'react';
import { Dialog, DialogSizes } from './Dialog';
import { loremIpsum } from '../../stories/knobs';

export default {
    title: 'LumX components/dialog/Dialog',
    parameters: {
        // Notifies Chromatic to pause the animations when they finish for the specific story.
        chromatic: { pauseAnimationAtEnd: true },
    },
};

const header = <header className="lumx-spacing-padding lumx-typography-title">Dialog header</header>;
const content = <div className="lumx-spacing-padding">{loremIpsum('short')}</div>;
const longContent = <div className="lumx-spacing-padding">{loremIpsum('long')}</div>;
const footer = <footer className="lumx-spacing-padding">Dialog footer</footer>;

function useOpenButton(theme: Theme) {
    const buttonRef = useRef() as RefObject<HTMLButtonElement>;
    const [isOpen, setOpen] = useState(true);
    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return {
        button: (
            <Button ref={buttonRef} onClick={openDialog} theme={theme}>
                Open dialog
            </Button>
        ),
        buttonRef,
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

export const DialogWithFocusableElements = ({ theme }: any) => {
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

                    <FlexBox orientation="horizontal">
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
                    </FlexBox>

                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                    <div tabIndex={0}>Focus div</div>
                </div>
            </Dialog>
        </>
    );
};
