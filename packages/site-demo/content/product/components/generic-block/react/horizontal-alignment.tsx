import { GenericBlock } from '@lumx/react';
import { Placeholder } from '@lumx/demo/components/content/Placeholder';

const aligns = ['top', 'center', 'bottom'] as const;

export const App = () =>
    aligns.map((hAlign, idx) => (
        <div key={idx}>
            <GenericBlock
                orientation="horizontal"
                style={{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: 2 }}
                // Horizontal align
                hAlign={hAlign}
            >
                <GenericBlock.Figure>
                    <Placeholder name="1" />
                </GenericBlock.Figure>

                <GenericBlock.Content>
                    <Placeholder name="2" textAlign="left" height={72} width={104} />
                </GenericBlock.Content>

                <GenericBlock.Actions>
                    <Placeholder name="3" textAlign="right" width={72} />
                </GenericBlock.Actions>
            </GenericBlock>
            <code>{hAlign}</code>
        </div>
    ));
