import { render, screen } from '@testing-library/react';
import { skipRender } from './skipRender';

describe('skipRender', () => {
    it('should render component if predicate is true', () => {
        const Comp = () => <div>Content</div>;
        const Wrapped = skipRender((props: { show: boolean }) => props.show, Comp as any);

        render(<Wrapped show />);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should NOT render component if predicate is false', () => {
        const Comp = () => <div>Content</div>;
        const Wrapped = skipRender((props: { show: boolean }) => props.show, Comp as any);

        render(<Wrapped show={false} />);
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
});
