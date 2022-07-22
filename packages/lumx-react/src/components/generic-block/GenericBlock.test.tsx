import React, { createRef } from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite } from '@lumx/react/testing/utils';

import { GenericBlock, GenericBlockProps } from './GenericBlock';

const CLASSNAME = GenericBlock.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<GenericBlockProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<GenericBlock {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${GenericBlock.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        it('should render default', () => {
            const wrapper = shallow(<GenericBlock>Content</GenericBlock>);

            expect(wrapper.prop('gap')).toBe('regular');
            expect(wrapper.prop('hAlign')).toBe('center');
            expect(wrapper.prop('orientation')).toBe('vertical');
            expect(wrapper.prop('vAlign')).toBe('center');

            const figure = wrapper.find('.lumx-generic-block__figure');
            expect(figure).toBeDefined();

            const content = wrapper.find('.lumx-generic-block__content');
            expect(content.prop('fillSpace')).toBe(true);
            expect(content.prop('vAlign')).toBe('center');
            expect(content.prop('orientation')).toBe('vertical');

            const actions = wrapper.find('.lumx-generic-block__actions');
            expect(actions.prop('vAlign')).toBe('center');
        });

        it('should render horizontal', () => {
            const wrapper = shallow(<GenericBlock orientation="horizontal">Content</GenericBlock>);

            expect(wrapper.prop('gap')).toBe('regular');
            expect(wrapper.prop('hAlign')).toBe('center');
            expect(wrapper.prop('orientation')).toBe('horizontal');
            expect(wrapper.prop('vAlign')).toBe('center');

            const figure = wrapper.find('.lumx-generic-block__figure');
            expect(figure).toBeDefined();

            const content = wrapper.find('.lumx-generic-block__content');
            expect(content.prop('fillSpace')).toBe(true);
            expect(content.prop('vAlign')).toBe('left');
            expect(content.prop('orientation')).toBe('vertical');

            const actions = wrapper.find('.lumx-generic-block__actions');
            expect(actions.prop('vAlign')).toBe('right');
        });

        it('should combine figure props', () => {
            const wrapper = shallow(
                <GenericBlock figure="Figure 1" figureProps={{ className: 'figure1', vAlign: 'left' }}>
                    <GenericBlock.Figure className="figure2" fillSpace>
                        Figure 2
                    </GenericBlock.Figure>
                </GenericBlock>,
            );

            const figure = wrapper.find('.lumx-generic-block__figure');
            expect(figure).toHaveClassName('figure1');
            expect(figure).toHaveClassName('figure2');
            expect(figure.prop('fillSpace')).toBe(true);
            expect(figure.prop('vAlign')).toBe('left');
            expect(figure).toHaveText('Figure 1Figure 2');
        });

        it('should combine content props', () => {
            const wrapper = shallow(
                <GenericBlock contentProps={{ className: 'content1', vAlign: 'left' }}>
                    Content 1
                    <GenericBlock.Content className="content2" fillSpace>
                        Content 2
                    </GenericBlock.Content>
                </GenericBlock>,
            );

            const content = wrapper.find('.lumx-generic-block__content');
            expect(content).toHaveClassName('content1');
            expect(content).toHaveClassName('content2');
            expect(content.prop('fillSpace')).toBe(true);
            expect(content.prop('vAlign')).toBe('left');
            expect(content).toHaveText('Content 2Content 1');
        });

        it('should combine actions props', () => {
            const wrapper = shallow(
                <GenericBlock actions="Actions 1" actionsProps={{ className: 'actions1', vAlign: 'left' }}>
                    <GenericBlock.Actions className="actions2" fillSpace>
                        Actions 2
                    </GenericBlock.Actions>
                </GenericBlock>,
            );

            const actions = wrapper.find('.lumx-generic-block__actions');
            expect(actions).toHaveClassName('actions1');
            expect(actions).toHaveClassName('actions2');
            expect(actions.prop('fillSpace')).toBe(true);
            expect(actions.prop('vAlign')).toBe('left');
            expect(actions).toHaveText('Actions 1Actions 2');
        });

        it('should forward refs', () => {
            const rootRef = createRef<HTMLDivElement>();
            const figureRef = createRef<HTMLDivElement>();
            const contentRef = createRef<HTMLDivElement>();
            const actionsRef = createRef<HTMLDivElement>();
            shallow(
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
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
