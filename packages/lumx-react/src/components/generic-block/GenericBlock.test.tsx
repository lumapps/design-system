import { createRef } from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';

import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { GenericBlock, GenericBlockProps } from '.';

const CLASSNAME = GenericBlock.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<GenericBlockProps> = {}) => {
    render(<GenericBlock {...(props as any)} />);
    const genericBlock = getByClassName(document.body, CLASSNAME);
    const figure = queryByClassName(genericBlock, 'lumx-generic-block__figure');
    const content = queryByClassName(genericBlock, 'lumx-generic-block__content');
    const actions = queryByClassName(genericBlock, 'lumx-generic-block__actions');
    return { props, genericBlock, figure, content, actions };
};

describe(`<${GenericBlock.displayName}>`, () => {
    describe('Props', () => {
        it('should render content', () => {
            const { genericBlock, content, figure, actions } = setup({ children: 'Content' });
            expect(genericBlock).toBeInTheDocument();
            expect(genericBlock.className).toMatchInlineSnapshot(
                '"lumx-generic-block lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--gap-big"',
            );

            expect(content).toBeInTheDocument();
            expect(content).toHaveTextContent('Content');
            expect(content?.className).toMatchInlineSnapshot(
                '"lumx-generic-block__content lumx-flex-box lumx-flex-box--orientation-vertical lumx-flex-box--fill-space"',
            );

            expect(figure).not.toBeInTheDocument();
            expect(actions).not.toBeInTheDocument();
        });

        it('should forward vAlign & hAlign', () => {
            const { genericBlock, figure, content, actions } = setup({
                children: 'Content',
                figure: 'Figure',
                actions: 'Actions',
                vAlign: 'left',
                hAlign: 'bottom',
            });

            expect(genericBlock?.className).toMatchInlineSnapshot(
                '"lumx-generic-block lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--v-align-left lumx-flex-box--h-align-bottom lumx-flex-box--gap-big"',
            );
            expect(figure?.className).toMatchInlineSnapshot(
                '"lumx-generic-block__figure lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--v-align-left lumx-flex-box--h-align-bottom"',
            );
            expect(content?.className).toMatchInlineSnapshot(
                '"lumx-generic-block__content lumx-flex-box lumx-flex-box--orientation-vertical lumx-flex-box--v-align-left lumx-flex-box--h-align-bottom lumx-flex-box--fill-space"',
            );
            expect(actions?.className).toMatchInlineSnapshot(
                '"lumx-generic-block__actions lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--v-align-left lumx-flex-box--h-align-bottom"',
            );
        });

        it('should combine figure props', () => {
            const { figure, content, actions } = setup({
                figure: 'Figure 1',
                figureProps: { className: 'figure1', vAlign: 'left' },
                children: (
                    <GenericBlock.Figure className="figure2" fillSpace>
                        Figure 2
                    </GenericBlock.Figure>
                ),
            });

            // Merged class names
            expect(figure?.className).toMatchInlineSnapshot(
                '"figure1 figure2 lumx-generic-block__figure lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--v-align-left lumx-flex-box--fill-space"',
            );
            // Merged content
            expect(figure).toHaveTextContent('Figure 1Figure 2');

            expect(content).not.toBeInTheDocument();
            expect(actions).not.toBeInTheDocument();
        });

        it('should combine content props', () => {
            const { figure, content, actions } = setup({
                children: [
                    'Content 1',
                    <GenericBlock.Content key="content" className="content2" fillSpace>
                        Content 2
                    </GenericBlock.Content>,
                ],
                contentProps: { className: 'content1', vAlign: 'left' },
            });

            // Merged class names
            expect(content?.className).toMatchInlineSnapshot(
                '"content1 content2 lumx-generic-block__content lumx-flex-box lumx-flex-box--orientation-vertical lumx-flex-box--v-align-left lumx-flex-box--fill-space"',
            );
            // Merged content
            expect(content).toHaveTextContent('Content 2Content 1');

            expect(figure).not.toBeInTheDocument();
            expect(actions).not.toBeInTheDocument();
        });

        it('should combine actions props', () => {
            const { figure, content, actions } = setup({
                actions: 'Actions 1',
                actionsProps: { className: 'actions1', vAlign: 'left' },
                children: (
                    <GenericBlock.Actions className="actions2" fillSpace>
                        Actions 2
                    </GenericBlock.Actions>
                ),
            });

            // Merged class names
            expect(actions?.className).toMatchInlineSnapshot(
                '"actions1 actions2 lumx-generic-block__actions lumx-flex-box lumx-flex-box--orientation-horizontal lumx-flex-box--v-align-left lumx-flex-box--fill-space"',
            );
            // Merged content
            expect(actions).toHaveTextContent('Actions 1Actions 2');

            expect(content).not.toBeInTheDocument();
            expect(figure).not.toBeInTheDocument();
        });

        it('should forward refs', () => {
            const rootRef = createRef<HTMLDivElement>();
            const figureRef = createRef<HTMLDivElement>();
            const contentRef = createRef<HTMLDivElement>();
            const actionsRef = createRef<HTMLDivElement>();
            render(
                <GenericBlock ref={rootRef}>
                    <GenericBlock.Figure ref={figureRef} />
                    <GenericBlock.Content ref={contentRef} />
                    <GenericBlock.Actions ref={actionsRef} />
                </GenericBlock>,
            );
            expect(rootRef.current).toBeDefined();
            expect(figureRef.current).toBeDefined();
            expect(contentRef.current).toBeDefined();
            expect(actionsRef.current).toBeDefined();
        });

        it('should filter out empty children (null, undefined, false) from otherChildren', () => {
            const { content, figure, actions } = setup({
                children: [
                    null,
                    undefined,
                    false,
                    'Valid Content',
                    null,
                    'Another Valid Content',
                    undefined,
                ],
            });

            // Content should be rendered
            expect(content).toBeInTheDocument();
            expect(content).toHaveTextContent('Valid ContentAnother Valid Content');
            // Should not render figure or actions
            expect(figure).not.toBeInTheDocument();
            expect(actions).not.toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'genericBlock',
        forwardAttributes: 'genericBlock',
    });
});
