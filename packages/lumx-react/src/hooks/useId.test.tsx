import { useId } from '@lumx/react/hooks/useId';
import { render } from '@testing-library/react';

function setup() {
    const Component = (): any => useId();
    const result = render(<Component />);
    const rerender = () => result.rerender(<Component />);
    return { ...result, rerender };
}

describe(useId, () => {
    it('should render a unique id stable after re-renders', () => {
        const result = setup();
        // Id generated
        const initialId = result.container.textContent;
        expect(initialId).toMatch(/:lumx\d+:/);

        // Id is stable after re-render
        result.rerender();
        expect(result.container.textContent).toEqual(initialId);
    });
});
