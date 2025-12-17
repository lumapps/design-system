import { GenericBlock, GenericBlockGapSize } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

export const App = () =>
    Object.values(GenericBlockGapSize).map((gap) => (
        <div key={gap}>
            <GenericBlock
                orientation="vertical"
                hAlign="center"
                vAlign="center"
                style={{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: 2 }}
                // Gap size
                gap={gap}
            >
                <GenericBlock.Figure>
                    <Placeholder name="1" />
                </GenericBlock.Figure>

                <GenericBlock.Content>
                    <Placeholder name="2" height={52} width={104} />
                </GenericBlock.Content>

                <GenericBlock.Actions>
                    <Placeholder name="3" width={72} />
                </GenericBlock.Actions>
            </GenericBlock>
            <code>{gap}</code>
        </div>
    ));
