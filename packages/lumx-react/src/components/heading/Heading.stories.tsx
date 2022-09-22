import React from 'react';
import { imageKnob } from '@lumx/react/stories/knobs/image';
import { Orientation, Size, Typography } from '..';
import { Heading, HeadingLevelProvider } from '.';
import { FlexBox } from '../flex-box';
import { GenericBlock } from '../generic-block';
import { Thumbnail } from '../thumbnail';

export default { title: 'LumX components/heading/Heading' };

export const Default = () => {
    return (
        <div>
            {/* This will render a h1 */}
            <Heading>First level</Heading>
            <HeadingLevelProvider>
                {/* This will render a h2 */}
                <Heading>Second Level</Heading>
                <HeadingLevelProvider>
                    {/* This will render a h3 */}
                    <Heading>Third Level</Heading>
                    {/* This will also render a h3 */}
                    <Heading>Other Third Level</Heading>
                    <HeadingLevelProvider>
                        {/* This will render a h4 */}
                        <Heading>Fourth Level</Heading>
                        <HeadingLevelProvider>
                            {/* This will render a h5 */}
                            <Heading>Fifth Level</Heading>
                        </HeadingLevelProvider>
                    </HeadingLevelProvider>
                </HeadingLevelProvider>
            </HeadingLevelProvider>
        </div>
    );
};

export const LevelOverride = () => {
    return (
        <div>
            {/* This will render a h1 */}
            <Heading>First level</Heading>
            <HeadingLevelProvider>
                {/* This will render a h2 */}
                <Heading>Second Level</Heading>
                <HeadingLevelProvider level={2}>
                    {/* This will also render a h2 */}
                    <Heading>Lorem ipsum</Heading>
                    <Heading>Dolor sit amet</Heading>
                    <Heading>Reprehenderit et aute</Heading>
                </HeadingLevelProvider>
            </HeadingLevelProvider>
        </div>
    );
};

export const HeadingManualOverride = () => {
    return (
        <div>
            {/* This will render a h1 */}
            <Heading>First level</Heading>
            <HeadingLevelProvider>
                {/* This will render a h2 */}
                <Heading as="h2">Forced second Level</Heading>
                <Heading as="h3">Forced third Level</Heading>
                <Heading as="h4">Forced fourth Level</Heading>
            </HeadingLevelProvider>
        </div>
    );
};

const ListWithSubElements = () => {
    return (
        <HeadingLevelProvider>
            <FlexBox orientation={Orientation.vertical} gap={Size.big}>
                <GenericBlock figure={<Thumbnail image={imageKnob()} alt="First Item" size={Size.l} />}>
                    <Heading typography={Typography.subtitle2}>First item</Heading>
                </GenericBlock>
                <GenericBlock figure={<Thumbnail image={imageKnob()} alt="First Item" size={Size.l} />}>
                    <Heading typography={Typography.subtitle2}>Second item</Heading>
                </GenericBlock>
                <GenericBlock figure={<Thumbnail image={imageKnob()} alt="First Item" size={Size.l} />}>
                    <Heading typography={Typography.subtitle2}>Third item</Heading>
                </GenericBlock>
            </FlexBox>
        </HeadingLevelProvider>
    );
};

export const TypographyOverride = () => {
    return (
        <FlexBox orientation={Orientation.vertical} gap={Size.big}>
            <Heading>My lists</Heading>

            <FlexBox orientation={Orientation.horizontal} gap={Size.huge}>
                <ListWithSubElements />

                <FlexBox orientation={Orientation.vertical} gap={Size.big}>
                    <HeadingLevelProvider>
                        <Heading>Sub list</Heading>

                        <ListWithSubElements />
                    </HeadingLevelProvider>
                </FlexBox>
            </FlexBox>
        </FlexBox>
    );
};
