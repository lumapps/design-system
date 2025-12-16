import { mdiDotsVertical } from '@lumx/icons';

import {
    Button,
    Divider,
    ExpansionPanel,
    FlexBox,
    GenericBlock,
    Heading,
    IconButton,
    Text,
    Thumbnail,
} from '@lumx/react';
import { useState } from 'react';

export const App = () => {
    const [isOpen1, setOpen1] = useState(false);
    const [isOpen2, setOpen2] = useState(false);
    const [isOpen3, setOpen3] = useState(false);
    const [isOpen4, setOpen4] = useState(false);
    const [isOpen5, setOpen5] = useState(false);
    const stopPropagation = (evt: Event) => evt.stopPropagation();

    const handleCloseAll = () => {
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
        setOpen5(false);
    };

    return (
        <>
            <Button type="button" onClick={handleCloseAll}>
                Close all
            </Button>
            <ExpansionPanel
                hasBackground
                hasHeaderDivider
                isOpen={isOpen1}
                onToggleOpen={setOpen1}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <header>
                    <GenericBlock
                        className="lumx-spacing-margin-left-regular"
                        hAlign="center"
                        figure={<Thumbnail alt="" image="/demo-assets/square1.jpg" size="m" variant="rounded" />}
                    >
                        <Heading typography="body1">With thumbnail</Heading>
                    </GenericBlock>
                </header>

                <div className="lumx-spacing-padding-big">
                    <Text as="p" typography="subtitle1">
                        Curabitur est gravida et libero vitae dictum.
                    </Text>
                    <Text as="p" typography="body1">
                        Etiam habebis sem dicantur magna mollis euismod.
                    </Text>
                </div>
            </ExpansionPanel>

            <ExpansionPanel
                hasBackground
                hasHeaderDivider
                isOpen={isOpen2}
                onToggleOpen={setOpen2}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <header>
                    <GenericBlock
                        className="lumx-spacing-margin-left-regular"
                        hAlign="center"
                        figure={<Thumbnail alt="" image="/demo-assets/square1.jpg" size="m" variant="rounded" />}
                    >
                        <Heading typography="body1">With thumbnail</Heading>
                        <Text as="p" typography="caption" color="dark-L2">
                            And secondary text
                        </Text>
                    </GenericBlock>
                </header>

                <div className="lumx-spacing-padding-big">
                    <Text as="p" typography="subtitle1">
                        Curabitur est gravida et libero vitae dictum.
                    </Text>
                    <Text as="p" typography="body1">
                        Etiam habebis sem dicantur magna mollis euismod.
                    </Text>
                </div>
            </ExpansionPanel>

            <ExpansionPanel
                hasBackground
                isOpen={isOpen3}
                onToggleOpen={setOpen3}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <header>
                    <FlexBox className="lumx-spacing-margin-left-big" orientation="horizontal" hAlign="center">
                        <Text as="p" typography="body1">
                            With secondary action
                        </Text>

                        <FlexBox marginAuto="left">
                            <IconButton
                                label="Secondary actions"
                                icon={mdiDotsVertical}
                                emphasis="low"
                                size="m"
                                onClick={stopPropagation}
                            />
                        </FlexBox>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-big lumx-spacing-padding-top-none">
                    <Text as="p" typography="subtitle1">
                        Curabitur est gravida et libero vitae dictum.
                    </Text>
                    <Text as="p" typography="body1">
                        Etiam habebis sem dicantur magna mollis euismod.
                    </Text>
                </div>
            </ExpansionPanel>

            <ExpansionPanel isOpen={isOpen4} onToggleOpen={setOpen4} toggleButtonProps={{ label: 'Toggle' }}>
                <header>
                    <GenericBlock
                        hAlign="center"
                        figure={<Thumbnail alt="" image="/demo-assets/square1.jpg" size="m" variant="rounded" />}
                    >
                        <Heading typography="body1">With Dividers</Heading>
                    </GenericBlock>
                </header>

                <div className="lumx-spacing-padding-top">
                    <Text as="p" typography="subtitle1">
                        Curabitur est gravida et libero vitae dictum.
                    </Text>
                    <Text as="p" typography="body1">
                        Etiam habebis sem dicantur magna mollis euismod.
                    </Text>
                </div>
            </ExpansionPanel>

            <Divider />

            <ExpansionPanel isOpen={isOpen5} onToggleOpen={setOpen5} toggleButtonProps={{ label: 'Toggle' }}>
                <header>
                    <GenericBlock
                        hAlign="center"
                        figure={<Thumbnail alt="" image="/demo-assets/square1.jpg" size="m" variant="rounded" />}
                    >
                        <Heading typography="body1">With Dividers</Heading>
                    </GenericBlock>
                </header>

                <div className="lumx-spacing-padding-top">
                    <Text as="p" typography="subtitle1">
                        Curabitur est gravida et libero vitae dictum.
                    </Text>
                    <Text as="p" typography="body1">
                        Etiam habebis sem dicantur magna mollis euismod.
                    </Text>
                </div>
            </ExpansionPanel>
        </>
    );
};
