import { Button, Dialog, Emphasis, Toolbar } from '@lumx/react';
import React, { useCallback, useRef, useState } from 'react';

const App = ({ theme }) => {
    const [people, setPeople] = useState([
        { age: 10, email: 'adam@email.com', name: 'Adam' },
        { age: 12, email: 'amalie@email.com', name: 'Amalie' },
        { age: 30, email: 'wladimir@email.com', name: 'Wladimir' },
        { age: 31, email: 'samantha@email.com', name: 'Samantha' },
        { age: 16, email: 'estefanía@email.com', name: 'Estefanía' },
        { age: 54, email: 'natasha@email.com', name: 'Natasha' },
        { age: 43, email: 'nicole@email.com', name: 'Nicole' },
        { age: 21, email: 'adrian@email.com', name: 'Adrian' },
    ]);
    const addPerson = () => {
        setPeople([...people, { age: 99, email: 'lorem@email.com', name: 'Lorem' }]);
    };

    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);

    const buttonRef = useRef(null);
    const addPersonButtonRef = useRef(null);

    return (
        <div className="demo-grid">
            <Button buttonRef={buttonRef} onClick={toggle} theme={theme}>
                Open dialog with actions
            </Button>

            <Dialog isOpen={isOpen} parentElement={buttonRef} onClose={close} focusElement={addPersonButtonRef}>
                <header>
                    <Toolbar
                        label={<span className="lumx-typography-title">Dialog with action</span>}
                        after={
                            <Button buttonRef={addPersonButtonRef} emphasis={Emphasis.low} onClick={addPerson}>
                                Add
                            </Button>
                        }
                    />
                </header>

                <div className="lumx-spacing-padding-horizontal-huge">
                    {people.map((person) => (
                        <div key={person.email}>
                            {person.name} - {person.email} - {person.age}
                        </div>
                    ))}
                </div>

                <footer>
                    <Toolbar
                        after={
                            <>
                                <Button emphasis={Emphasis.medium} onClick={close}>
                                    Cancel
                                </Button>
                                <Button className="lumx-spacing-margin-left-regular" onClick={close}>
                                    Save
                                </Button>
                            </>
                        }
                    />
                </footer>
            </Dialog>
        </div>
    );
};

export default App;
