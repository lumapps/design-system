import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-generic-block';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    render(propsOverride, options);
    const genericBlock = getByClassName(document.body, CLASSNAME);
    const figure = queryByClassName(genericBlock, 'lumx-generic-block__figure');
    const content = queryByClassName(genericBlock, 'lumx-generic-block__content');
    const actions = queryByClassName(genericBlock, 'lumx-generic-block__actions');
    return { props: propsOverride, genericBlock, figure, content, actions };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('GenericBlock core tests', () => {
        describe('Props', () => {
            it('should render content', () => {
                const { genericBlock, content, figure, actions } = setup({ children: 'Content' }, renderOptions);
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
                const { genericBlock, figure, content, actions } = setup(
                    {
                        children: 'Content',
                        figure: 'Figure',
                        actions: 'Actions',
                        vAlign: 'left',
                        hAlign: 'bottom',
                    },
                    renderOptions,
                );

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

            it('should not render empty sections', () => {
                const { figure, actions } = setup({ children: 'Content' }, renderOptions);
                expect(figure).not.toBeInTheDocument();
                expect(actions).not.toBeInTheDocument();
            });
        });
    });
};
