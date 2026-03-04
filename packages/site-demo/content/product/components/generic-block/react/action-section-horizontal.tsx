import { Button, GenericBlock } from '@lumx/react';
import { mdiStarOutline } from '@lumx/icons';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock as="article" orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Placeholder name="1" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Button emphasis="medium" size="m" leftIcon={mdiStarOutline}>
                    Follow
                </Button>
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock as="article" orientation="vertical" vAlign="center">
            <GenericBlock.Figure>
                <Placeholder name="1" width={64} height={64} />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" height={52} width={104} />
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Button emphasis="medium" size="s">
                    Follow
                </Button>
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
