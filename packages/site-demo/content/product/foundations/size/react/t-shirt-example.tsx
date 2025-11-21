import { Alignment, FlexBox, Size, UserBlock } from '@lumx/react';

export const App = () => (
    <>
        <UserBlock
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="/demo-assets/persona.png"
            size={Size.m}
            className="lumx-spacing-margin-right-huge"
        />
        <FlexBox
            hAlign={Alignment.center}
            vAlign={Alignment.center}
            className="lumx-color-background-dark-L6 lumx-color-font-dark-L3"
            style={{ width: '36px', height: '36px' }}
        >
            m
        </FlexBox>
    </>
);
