import { Button, Checkbox, GenericBlock } from '@lumx/react';
import { mdiClose, mdiMenuDown } from '@lumx/icons';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock as="article" orientation="horizontal" style={{ maxWidth: 517 }} gap="medium">
            <GenericBlock.Figure>
                <Placeholder name="1" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" textAlign="left" width={244} />
            </GenericBlock.Content>
            <GenericBlock.Actions hAlign="center" gap="tiny">
                <Button emphasis="medium" size="m" rightIcon={mdiMenuDown}>
                    Role
                </Button>
                <Button emphasis="medium" size="m" leftIcon={mdiClose}>
                    Medium
                </Button>
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock as="article" orientation="horizontal" style={{ maxWidth: 424, width: '100%' }} gap="medium">
            <GenericBlock.Figure>
                <Placeholder name="1" height={64} width={64} />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Placeholder name="2" textAlign="left" height={64} width="100%" />
            </GenericBlock.Content>
            <GenericBlock.Actions hAlign="center">
                <Checkbox isDisabled inputProps={{ 'aria-label': 'Select row' }} />
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
