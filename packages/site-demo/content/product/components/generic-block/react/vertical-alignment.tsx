import { GenericBlock } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

const aligns = ['right', 'center', 'left'] as const;

export const App = () =>
    aligns.map((vAlign, idx) => (
        <div key={idx}>
            <GenericBlock
                orientation="vertical"
                style={{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: 2 }}
                // Vertical align
                vAlign={vAlign}
            >
                <GenericBlock.Figure>
                    <Placeholder name="1" />
                </GenericBlock.Figure>

                <GenericBlock.Content>
                    <Placeholder name="2" height={72} width={104} />
                </GenericBlock.Content>

                <GenericBlock.Actions>
                    <Placeholder name="3" width={72} />
                </GenericBlock.Actions>
            </GenericBlock>
            <code>{vAlign}</code>
        </div>
    ));
