/* eslint-disable react-hooks/rules-of-hooks,react/jsx-key */
import React, { useRef, useState } from 'react';

import over from 'lodash/over';
import { mdiClose } from '@lumx/icons';
import {
    AlertDialog,
    Button,
    Checkbox,
    DatePickerField,
    Emphasis,
    FlexBox,
    Heading,
    IconButton,
    List,
    ListItem,
    Select,
    Size,
    TextField,
    Toolbar,
} from '@lumx/react';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';

import { Dialog } from './Dialog';

const dialogSizes = [Size.tiny, Size.regular, Size.big, Size.huge];

export default {
    title: 'LumX components/dialog/Dialog',
    component: Dialog,
    parameters: {
        // Delay Chromatic snapshot to wait for dialog to open.
        chromatic: {
            pauseAnimationAtEnd: true,
            delay: DIALOG_TRANSITION_DURATION,
        },
    },
    decorators: [
        // Force minimum chromatic screen size to make sure the dialog appears in view.
        withChromaticForceScreenSize(),
    ],
    args: Dialog.defaultProps,
    argTypes: {
        size: getSelectArgType(dialogSizes),
        onVisibilityChange: { action: true },
        children: { control: false },
    },
    render(props: any) {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [isOpen, close, open] = useBooleanState(true);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open dialog
                </Button>
                <Dialog {...props} isOpen={isOpen} onClose={close} parentElement={buttonRef} />
            </>
        );
    },
};

/**
 * Default dialog
 */
export const Default = {
    args: { children: loremIpsum('short') },
};

/**
 * Loading state
 */
export const Loading = {
    args: { ...Default.args, isLoading: true },
};

/**
 * Basic header/footer props
 */
export const WithHeaderFooter = {
    args: { ...Default.args, header: 'Dialog header', footer: 'Dialog footer' },
};

/**
 * More complex header/footer in children
 */
export const WithHeaderFooterChildren = {
    args: {
        children: [
            <header>
                <Toolbar
                    label={<Heading typography="title">Dialog heading</Heading>}
                    after={<IconButton label="Close" emphasis="low" icon={mdiClose} />}
                />
            </header>,
            <div className="lumx-spacing-padding-huge">{loremIpsum('short')}</div>,
            <footer>
                <Toolbar after={<Button>Close</Button>} />
            </footer>,
        ],
    },
};

/**
 * Forcing header/footer dividers
 */
export const ForceDivider = {
    args: { ...WithHeaderFooter.args, forceFooterDivider: true, forceHeaderDivider: true },
};

/**
 * Long scrollable content
 */
export const LongContent = {
    args: { ...WithHeaderFooter.args, children: loremIpsum('long') },
};

/**
 * Prevent auto close (click outside & close on escape)
 */
export const PreventAutoClose = {
    args: { ...Default.args, preventAutoClose: true },
};

/**
 * Prevent close on escape
 */
export const PreventCloseOnEscape = {
    args: { ...Default.args, preventCloseOnEscape: true },
};

/**
 * Prevent close on click outside
 */
export const PreventCloseOnClick = {
    args: { ...Default.args, preventCloseOnClick: true },
};

/**
 * Dialog needing a confirmation before close using an AlertDialog
 */
export const WithConfirmClose = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [isOpen, close, open] = useBooleanState(true);
    const [isAlertDialogOpen, closeAlertDialog, openAlertDialog] = useBooleanState(false);

    return (
        <>
            <Button ref={buttonRef} onClick={open}>
                Open dialog
            </Button>
            <Dialog isOpen={isOpen} onClose={openAlertDialog} parentElement={buttonRef}>
                <FlexBox orientation="vertical" vAlign="center" className="lumx-spacing-padding-huge">
                    {loremIpsum('tiny')}
                    <Button ref={closeButtonRef} onClick={openAlertDialog}>
                        Close
                    </Button>
                </FlexBox>
            </Dialog>
            <AlertDialog
                isOpen={isAlertDialogOpen}
                onClose={closeAlertDialog}
                parentElement={closeButtonRef}
                title="Confirm close"
                confirmProps={{ onClick: over([close, closeAlertDialog]), label: 'Confirm' }}
                cancelProps={{ onClick: closeAlertDialog, label: 'Cancel' }}
            >
                {loremIpsum('tiny')}
            </AlertDialog>
        </>
    );
};

/**
 * Test dialog focus trap (focus is contained inside the dialog) with all kinds of focusable and non-focusable items
 */
export const FocusTrap = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isOpen, close, open] = useBooleanState(true);
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
    const [date2, setDate2] = useState<Date | undefined>();

    const datePickerDialogButtonRef = useRef<HTMLButtonElement>(null);
    const [isDatePickerDialogOpen, closeDatePickerDialog, openDatePickerDialog] = useBooleanState(false);

    return (
        <>
            <Button ref={buttonRef} onClick={open}>
                Open dialog
            </Button>
            <Dialog isOpen={isOpen} onClose={close} parentElement={buttonRef} focusElement={inputRef}>
                <header>
                    <Toolbar
                        label={<span className="lumx-typography-title">Dialog header</span>}
                        after={<IconButton label="Close" icon={mdiClose} onClick={close} emphasis={Emphasis.low} />}
                    />
                </header>
                <div className="lumx-spacing-padding-horizontal-huge lumx-spacing-padding-bottom-huge">
                    {/* Testing hidden input do not count in th focus trap*/}
                    <input hidden type="file" />
                    <input type="hidden" />

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
                                    onChange={setDate}
                                    value={date}
                                    nextButtonProps={{ label: 'Next month' }}
                                    previousButtonProps={{ label: 'Previous month' }}
                                />
                                <DatePickerField
                                    locale="fr"
                                    label="Start date"
                                    placeholder="Pick a date"
                                    onChange={setDate2}
                                    value={date2}
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
