import { GenericBlock } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Placeholder name="1" height={64} width={64} />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} />
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock orientation="horizontal">
            <GenericBlock.Figure>
                <Placeholder name="1" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" width={122} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} textAlign="right" />
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
