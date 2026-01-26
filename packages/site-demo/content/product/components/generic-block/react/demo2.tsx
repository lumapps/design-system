import { Avatar, GenericBlock, Icon, Thumbnail } from '@lumx/react';
import { mdiPlus } from '@lumx/icons';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock as="article" orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Avatar image="https://i.pravatar.cc/128?img=32" alt="Emmitt O Lum. Profile Photo" size="l" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} />
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock as="article" orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Thumbnail image="https://picsum.photos/id/24/640/480" alt="Book" variant="rounded" size="xl" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} />
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock as="article" orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Icon icon={mdiPlus} size="l" hasShape />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} />
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
