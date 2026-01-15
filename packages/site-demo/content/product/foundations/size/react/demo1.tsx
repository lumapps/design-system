import { FlexBox, UserBlock } from '@lumx/react';

export default () => (
    <>
        <UserBlock
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="/demo-assets/persona.png"
            size="m"
        />

        <FlexBox
            hAlign="center"
            vAlign="center"
            className="lumx-color-background-dark-L6 lumx-color-font-dark-L3"
            style={{ width: '36px', height: '36px' }}
        >
            m
        </FlexBox>
    </>
);
