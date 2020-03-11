import { mdiClose } from '@lumx/icons';
import {
    Button,
    Checkbox,
    Dialog,
    Emphasis,
    IconButton,
    List,
    ListItem,
    Select,
    Size,
    TextField,
    Theme,
    Toolbar,
} from '@lumx/react';
import { DialogSizes } from '@lumx/react/components/dialog/Dialog';
import { select } from '@storybook/addon-knobs';
import React, { RefObject, useRef, useState } from 'react';

export default { title: 'Dialog' };

function useOpenButton(theme: Theme) {
    const buttonRef = useRef() as RefObject<HTMLButtonElement>;
    const [isOpen, setOpen] = useState(true);
    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return {
        button: (
            <Button buttonRef={buttonRef} onClick={openDialog} theme={theme}>
                Open dialog
            </Button>
        ),
        buttonRef,
        closeDialog,
        isOpen,
    };
}

export const simpleDialog = ({ theme }: any) => {
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

export const preventDialogAutoClose = ({ theme }: any) => {
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

export const dialogSizes = ({ theme }: any) => {
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

export const loadingDialog = ({ theme }: any) => {
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

export const dialogWithHeaderFooterProps = ({ theme }: any) => {
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

export const dialogWithHeaderFooterChildren = ({ theme }: any) => {
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

export const dialogWithHeaderFooterPropsAndChildren = ({ theme }: any) => {
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

export const dialogWithHeaderFooterAndDivider = ({ theme }: any) => {
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

export const scrollableDialog = ({ theme }: any) => {
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

export const scrollableDialogWithHeaderAndFooter = ({ theme }: any) => {
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

export const dialogWithFocusableElements = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);
    const [textValue, setTextValue] = useState('value');
    const [checkboxValue, setCheckboxValue] = useState(false);
    const inputRef = useRef(null);

    const selectChoices = ['First item', 'Second item', 'Third item'];
    const [values, setValues] = React.useState<string[]>([]);
    const [isSelectOpen, setSelectOpen] = useState(false);
    const toggleSelect = () => setSelectOpen(!isSelectOpen);
    const closeSelect = () => setSelectOpen(false);
    const selectItem = (item: any) => () => {
        if (values.includes(item)) {
            return;
        }
        closeSelect();
        setValues([item]);
    };
    return (
        <>
            {button}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
                preventAutoClose
                focusElement={inputRef}
            >
                <header>
                    <Toolbar
                        label={<span className="lumx-typography-title">Dialog header</span>}
                        after={<IconButton icon={mdiClose} onClick={closeDialog} emphasis={Emphasis.low} />}
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
                        value={checkboxValue}
                        onChange={setCheckboxValue}
                        label="Checkbox input"
                    />

                    <Select
                        className="lumx-spacing-margin-bottom-huge"
                        isOpen={isSelectOpen}
                        value={values}
                        label="Select label"
                        onInputClick={toggleSelect}
                        onDropdownClose={closeSelect}
                    >
                        <List isClickable>
                            {selectChoices.map((choice) => (
                                <ListItem
                                    key={choice}
                                    isSelected={values.includes(choice)}
                                    onItemSelected={selectItem(choice)}
                                    size={Size.tiny}
                                >
                                    {choice}
                                </ListItem>
                            ))}
                        </List>
                    </Select>
                    <div tabIndex={0}>Focus div</div>
                </div>
            </Dialog>
        </>
    );
};

const shortText = `
Nihil hic munitissimus habendi senatus locus, nihil horum? At nos hinc posthac, sitientis piros
Afros. Magna pars studiorum, prodita quaerimus. Integer legentibus erat a ante historiarum
dapibus. Praeterea iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea
commodi consequat. Inmensae subtilitatis, obscuris et malesuada fames. Me non paenitet nullum
festiviorem excogitasse ad hoc. Cum ceteris in veneratione tui montes, nascetur mus. Etiam
habebis sem dicantur magna mollis euismod. Quis aute iure reprehenderit in voluptate velit esse.
Phasellus laoreet lorem vel dolor tempus vehicula. Ambitioni dedisse scripsisse iudicaretur.
Paullum deliquit, ponderibus modulisque suis ratio utitur. Ab illo tempore, ab est sed
immemorabili. Nec dubitamus multa iter quae et nos invenerat. Tu quoque, Brute, fili mi, nihil
timor populi, nihil! Morbi fringilla convallis sapien, id pulvinar odio volutpat. Cras mattis
iudicium purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
Quisque ut dolor gravida, placerat libero vel, euismod. Unam incolunt Belgae, aliam Aquitani,
tertiam. Cras mattis iudicium purus sit amet fermentum`;
const longText = `
${shortText}. Prima luce, cum quibus mons aliud
consensu ab eo. Vivamus sagittis lacus vel augue laoreet rutrum faucibus. Petierunt uti sibi
concilium totius Galliae in diem certam indicere. Etiam habebis sem dicantur magna mollis
euismod. A communi observantia non est recedendum. Ut enim ad minim veniam, quis nostrud
exercitation. Paullum deliquit, ponderibus modulisque suis ratio utitur. Hi omnes lingua,
institutis, legibus inter se differunt. Magna pars studiorum, prodita quaerimus. Quisque ut
dolor gravida, placerat libero vel, euismod. Tityre, tu patulae recubans sub tegmine fagi dolor.
Excepteur sint obcaecat cupiditat non proident culpa. Plura mihi bona sunt, inclinet, amari
petere vellent. Quae vero auctorem tractata ab fiducia dicuntur. Inmensae subtilitatis, obscuris
et malesuada fames. Quo usque tandem abutere, Catilina, patientia nostra? Nihilne te nocturnum
praesidium Palati, nihil urbis vigiliae. Curabitur blandit tempus ardua ridiculus sed magna. Tu
quoque, Brute, fili mi, nihil timor populi, nihil! Nihil hic munitissimus habendi senatus locus,
nihil horum?Tu quoque, Brute, fili mi, nihil timor populi, nihil! Tityre, tu patulae recubans
sub tegmine fagi dolor. Plura mihi bona sunt, inclinet, amari petere vellent. Ullamco laboris
nisi ut aliquid ex ea commodi consequat. Pellentesque habitant morbi tristique senectus et
netus. Salutantibus vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur
adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Petierunt uti sibi
concilium totius Galliae in diem certam indicere. Contra legem facit qui id facit quod lex
prohibet. Integer legentibus erat a ante historiarum dapibus. Petierunt uti sibi concilium
totius Galliae in diem certam indicere. Ab illo tempore, ab est sed immemorabili. Nihil hic
munitissimus habendi senatus locus, nihil horum? Quisque ut dolor gravida, placerat libero vel,
euismod. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut
labore et dolore magna aliqua. Nec dubitamus multa iter quae et nos invenerat. Quam temere in
vitiis, legem sancimus haerentia. Donec sed odio operae, eu vulputate felis rhoncus. Idque
Caesaris facere voluntate liceret: sese habere. Paullum deliquit, ponderibus modulisque suis
ratio utitur. Quae vero auctorem tractata ab fiducia dicuntur. Gallia est omnis divisa in partes
tres, quarum. Etiam habebis sem dicantur magna mollis euismod. Fabio vel iudice vincam, sunt in
culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
incidunt ut labore et dolore magna aliqua. Tu quoque, Brute, fili mi, nihil timor populi, nihil!
Integer legentibus erat a ante historiarum dapibus. Tityre, tu patulae recubans sub tegmine fagi
dolor. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Idque Caesaris facere voluntate
liceret: sese habere. Quid securi etiam tamquam eu fugiat nulla pariatur. Pellentesque habitant
morbi tristique senectus et netus. Ut enim ad minim veniam, quis nostrud exercitation. Petierunt
uti sibi concilium totius Galliae in diem certam indicere. Curabitur est gravida et libero vitae
dictum. Qui ipsorum lingua Celtae, nostra Galli appellantur. Quam temere in vitiis, legem
sancimus haerentia. Phasellus laoreet lorem vel dolor tempus vehicula. Ab illo tempore, ab est
sed immemorabili. Praeterea iter est quasdam res quas ex communi. Quo usque tandem abutere,
Catilina, patientia nostra? Non equidem invideo, miror magis posuere velit aliquet. Excepteur
sint obcaecat cupiditat non proident culpa. Curabitur blandit tempus ardua ridiculus sed magna.
Plura mihi bona sunt, inclinet, amari petere vellent. Quae vero auctorem tractata ab fiducia
dicuntur. Me non paenitet nullum festiviorem excogitasse ad hoc. Unam incolunt Belgae, aliam
Aquitani, tertiam.`;

const header = <header className="lumx-spacing-padding lumx-typography-title">Dialog header</header>;
const content = <div className="lumx-spacing-padding">{shortText}</div>;
const longContent = <div className="lumx-spacing-padding">{longText}</div>;
const footer = <footer className="lumx-spacing-padding">Dialog footer</footer>;
