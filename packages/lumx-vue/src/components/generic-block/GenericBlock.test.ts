import { render, screen } from '@testing-library/vue';
import BaseGenericBlockTests, { setup } from '@lumx/core/js/components/GenericBlock/Tests';
import { CLASSNAME } from '@lumx/core/js/components/GenericBlock';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { GenericBlock } from '.';

describe('<GenericBlock />', () => {
    // Map core test props to Vue:
    // - children → default slot
    // - figure/actions → named slots (as string content)
    // - vAlign/hAlign → verticalAlign/horizontalAlign (Vue FlexBox convention)
    const renderGenericBlock = (
        { children, figure, actions, vAlign, hAlign, ...props }: any,
        options?: SetupRenderOptions<any>,
    ) => {
        const slots: Record<string, any> = {};
        if (children !== undefined) slots.default = () => children;
        if (figure !== undefined) slots.figure = () => figure;
        if (actions !== undefined) slots.actions = () => actions;
        return render(GenericBlock, {
            ...options,
            props: {
                verticalAlign: vAlign,
                horizontalAlign: hAlign,
                ...props,
            },
            slots,
        });
    };

    // Run core tests
    BaseGenericBlockTests({
        render: renderGenericBlock,
        screen,
    });

    const setupGenericBlock = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const result = setup(props, { ...options, render: renderGenericBlock, screen });
        return { ...result, div: result.genericBlock };
    };

    describe('Vue', () => {
        it('should render content via default slot', () => {
            const { genericBlock, content } = setupGenericBlock({ children: 'Slot Content' });
            expect(genericBlock).toBeInTheDocument();
            expect(content).toHaveTextContent('Slot Content');
        });

        it('should render figure via named slot', () => {
            const { figure } = setupGenericBlock({ children: 'Content', figure: 'Figure content' });
            expect(figure).toBeInTheDocument();
            expect(figure).toHaveTextContent('Figure content');
        });

        it('should render actions via named slot', () => {
            const { actions } = setupGenericBlock({ children: 'Content', actions: 'Actions content' });
            expect(actions).toBeInTheDocument();
            expect(actions).toHaveTextContent('Actions content');
        });
    });

    commonTestsSuiteVTL(setupGenericBlock, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
    });
});
