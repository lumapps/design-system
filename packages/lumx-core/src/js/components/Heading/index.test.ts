import { getHeadingProps } from './index';
import { Typography } from '../../constants';

describe('getHeadingProps', () => {
    it('should return default props when no props or context are provided', () => {
        const props = getHeadingProps({});
        expect(props).toEqual({
            as: 'h1',
            className: 'lumx-heading',
            typography: Typography.display1,
        });
    });

    it('should use "as" prop if provided', () => {
        const props = getHeadingProps({ as: 'h2' });
        expect(props).toEqual({
            as: 'h2',
            className: 'lumx-heading',
            typography: Typography.headline,
        });
    });

    it('should use "typography" prop if provided', () => {
        const props = getHeadingProps({ typography: Typography.body1 });
        expect(props).toEqual({
            as: 'h1',
            className: 'lumx-heading',
            typography: Typography.body1,
        });
    });

    it('should merge className', () => {
        const props = getHeadingProps({ className: 'custom-class' });
        expect(props).toEqual({
            as: 'h1',
            className: 'custom-class lumx-heading',
            typography: Typography.display1,
        });
    });

    it('should use context heading element if provided and "as" prop is missing', () => {
        const props = getHeadingProps({}, 'h3');
        expect(props).toEqual({
            as: 'h3',
            className: 'lumx-heading',
            typography: Typography.title,
        });
    });

    it('should prioritize "as" prop over context heading element', () => {
        const props = getHeadingProps({ as: 'h4' }, 'h3');
        expect(props).toEqual({
            as: 'h4',
            className: 'lumx-heading',
            typography: Typography.subtitle2,
        });
    });

    it('should map each heading level to its default typography', () => {
        expect(getHeadingProps({ as: 'h1' }).typography).toBe(Typography.display1);
        expect(getHeadingProps({ as: 'h2' }).typography).toBe(Typography.headline);
        expect(getHeadingProps({ as: 'h3' }).typography).toBe(Typography.title);
        expect(getHeadingProps({ as: 'h4' }).typography).toBe(Typography.subtitle2);
        expect(getHeadingProps({ as: 'h5' }).typography).toBe(Typography.subtitle1);
        expect(getHeadingProps({ as: 'h6' }).typography).toBe(Typography.body2);
    });

    it('should pass through other props', () => {
        const props = getHeadingProps({ id: 'test-id', 'data-testid': 'heading' } as any);
        expect(props).toEqual({
            as: 'h1',
            className: 'lumx-heading',
            typography: Typography.display1,
            id: 'test-id',
            'data-testid': 'heading',
        });
    });
});
