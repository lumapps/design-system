import React, { useState } from 'react';

import { mdiDotsVertical } from '@lumx/icons';

import {
    Alignment,
    Divider,
    Emphasis,
    ExpansionPanel,
    FlexBox,
    IconButton,
    Orientation,
    Size,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';

const App = () => {
    const [isOpen1, setOpen1] = useState(false);
    const [isOpen2, setOpen2] = useState(false);
    const [isOpen3, setOpen3] = useState(false);
    const [isOpen4, setOpen4] = useState(false);
    const [isOpen5, setOpen5] = useState(false);
    const [isOpen6, setOpen6] = useState(false);
    const stopPropagation = (evt: Event) => evt.stopPropagation();

    return (
        <>
            <ExpansionPanel hasBackground hasHeaderDivider isOpen={isOpen1} onToggleOpen={setOpen1}>
                <header>
                    <FlexBox
                        className="lumx-spacing-margin-left-regular"
                        orientation={Orientation.horizontal}
                        hAlign={Alignment.center}
                    >
                        <Thumbnail
                            image="https://picsum.photos/72/72/?random"
                            size={Size.m}
                            variant={ThumbnailVariant.rounded}
                        />

                        <span className="lumx-spacing-margin-left-big lumx-typography-body1">With thumbnail</span>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-big">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>

            <ExpansionPanel
                className="lumx-spacing-margin-top-big"
                hasBackground
                hasHeaderDivider
                isOpen={isOpen2}
                onToggleOpen={setOpen2}
            >
                <header>
                    <FlexBox
                        className="lumx-spacing-margin-left-regular"
                        orientation={Orientation.horizontal}
                        hAlign={Alignment.center}
                    >
                        <Thumbnail
                            image="https://picsum.photos/72/72/?random"
                            size={Size.m}
                            variant={ThumbnailVariant.rounded}
                        />

                        <div className="lumx-spacing-margin-left-big">
                            <span className="lumx-base-display-block lumx-typography-body1">With thumbnail</span>
                            <span className="lumx-base-display-block lumx-typography-caption lumx-color-font-dark-L2">
                                And secondary text
                            </span>
                        </div>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-big">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>

            <ExpansionPanel
                className="lumx-spacing-margin-top-big"
                hasBackground
                isOpen={isOpen3}
                onToggleOpen={setOpen3}
            >
                <header>
                    <FlexBox
                        className="lumx-spacing-margin-left-big"
                        orientation={Orientation.horizontal}
                        hAlign={Alignment.center}
                    >
                        <span className="lumx-typography-body1">With secondary action</span>

                        <FlexBox marginAuto={Alignment.left}>
                            <IconButton
                                icon={mdiDotsVertical}
                                emphasis={Emphasis.low}
                                size={Size.m}
                                onClick={stopPropagation}
                            />
                        </FlexBox>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-big lumx-spacing-padding-top-none">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>

            <ExpansionPanel className="lumx-spacing-margin-top-big" isOpen={isOpen4} onToggleOpen={setOpen4}>
                <header>
                    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                        <Thumbnail
                            image="https://picsum.photos/72/72/?random"
                            size={Size.m}
                            variant={ThumbnailVariant.rounded}
                        />

                        <span className="lumx-spacing-margin-left-big lumx-typography-body1">With Dividers</span>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-top">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>

            <Divider className="lumx-spacing-margin-vertical-big" />

            <ExpansionPanel isOpen={isOpen5} onToggleOpen={setOpen5}>
                <header>
                    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                        <Thumbnail
                            image="https://picsum.photos/72/72/?random"
                            size={Size.m}
                            variant={ThumbnailVariant.rounded}
                        />

                        <span className="lumx-spacing-margin-left-big lumx-typography-body1">With Dividers</span>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-top">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>

            <Divider className="lumx-spacing-margin-vertical-big" />

            <ExpansionPanel isOpen={isOpen6} onToggleOpen={setOpen6}>
                <header>
                    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                        <Thumbnail
                            image="https://picsum.photos/72/72/?random"
                            size={Size.m}
                            variant={ThumbnailVariant.rounded}
                        />

                        <span className="lumx-spacing-margin-left-big lumx-typography-body1">With Dividers</span>
                    </FlexBox>
                </header>

                <div className="lumx-spacing-padding-top">
                    <p className="lumx-typography-subtitle1">Curabitur est gravida et libero vitae dictum.</p>
                    <p className="lumx-typography-body1">Etiam habebis sem dicantur magna mollis euismod.</p>
                </div>
            </ExpansionPanel>
        </>
    );
};

export default App;
