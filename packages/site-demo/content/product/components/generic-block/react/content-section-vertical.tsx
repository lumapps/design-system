import { GenericBlock, Heading, Icon, InlineList, Link, Text } from '@lumx/react';
import { mdiEarth } from '@lumx/icons';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock as="article" orientation="horizontal" style={{ width: 494 }}>
            <GenericBlock.Figure>
                <Placeholder name="1" height={64} width={64} />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Heading as="h2" typography="subtitle2">
                    Marketing & Comms Workspace
                </Heading>
                <Text as="p" truncate typography="body1" color="dark-L2">
                    A space to collaborate on events, communication and a workspace.
                </Text>
                <InlineList typography="body1" color="dark-L2">
                    <Text as="span">
                        <Icon icon={mdiEarth} /> Open
                    </Text>
                    <Text as="span">1035 Members</Text>
                </InlineList>
            </GenericBlock.Content>
            <GenericBlock.Actions hAlign="center">
                <Placeholder name="3" width={80} textAlign="right" />
            </GenericBlock.Actions>
        </GenericBlock>

        <GenericBlock as="article" orientation="horizontal" style={{ width: 450 }}>
            <GenericBlock.Figure>
                <Placeholder name="1" />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Heading as="h2" typography="subtitle1">
                    Ines Gomez
                </Heading>
                <InlineList typography="body1" color="dark-L2">
                    <Text as="span">Account Manager</Text>
                    <Text as="span">
                        Added in <Link href="#">Sales Team</Link>
                    </Text>
                </InlineList>
            </GenericBlock.Content>
            <GenericBlock.Actions hAlign="center">
                <Placeholder name="3" width={72} textAlign="right" />
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
