import { classNames } from '@lumx/core/js/utils';
import { GenericBlock, Heading, Text, UserBlock } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export default () => (
    <>
        <GenericBlock as="article" orientation="vertical" vAlign="center" gap="big" style={{ maxWidth: 216 }}>
            <GenericBlock.Figure>
                <Placeholder name="2" height={154} width={216} />
            </GenericBlock.Figure>
            <GenericBlock.Content className={classNames.padding('horizontal', 'big')} vAlign="left" gap="tiny">
                <UserBlock name="Emmitt O. Lum" avatarProps={{ image: 'https://i.pravatar.cc/128?img=32' }} size="s" />
                <Heading as="h2" typography="subtitle2">
                    Fiscal Year Results and Conference
                </Heading>
                <Text as="p" typography="body1" color="dark-L2">
                    Our company will release its Fiscal Year Results next…
                </Text>
            </GenericBlock.Content>
        </GenericBlock>

        <GenericBlock as="article" orientation="vertical" vAlign="center" style={{ maxWidth: 184 }}>
            <GenericBlock.Figure>
                <Placeholder name="1" height={64} width={64} />
            </GenericBlock.Figure>
            <GenericBlock.Content>
                <Heading as="h2" typography="subtitle2">
                    Slack
                </Heading>
                <Text as="p" typography="body1" color="dark-L2">
                    A communication platform including chat rooms…
                </Text>
            </GenericBlock.Content>
            <GenericBlock.Actions>
                <Placeholder name="3" width={80} />
            </GenericBlock.Actions>
        </GenericBlock>
    </>
);
