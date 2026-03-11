import { createRef } from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';

import BaseGenericBlockTests, { setup as coreSetup } from '@lumx/core/js/components/GenericBlock/Tests';
import { GenericBlock, GenericBlockProps } from './GenericBlock';

const CLASSNAME = GenericBlock.className as string;

const renderGenericBlock = (props: any) => render(<GenericBlock {...props} />);

const setup = (props: Partial<GenericBlockProps> = {}, options: SetupRenderOptions = {}) =>
    coreSetup(props, { ...options, render: renderGenericBlock, screen });

describe(`<${GenericBlock.displayName}>`, () => {
    // Run core tests.
    BaseGenericBlockTests({ render: renderGenericBlock, screen });

    describe('Props', () => {
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

        it('should render as a different element', () => {
            const { container } = render(<GenericBlock {...({ as: 'section' } as any)}>Content</GenericBlock>);
            expect(container.querySelector('section')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'genericBlock',
        forwardAttributes: 'genericBlock',
    });
});
