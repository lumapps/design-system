import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from '../Heading';

/**
 * Mounts a standalone DialogHeading and returns the rendered heading element.
 *
 * The framework-specific `render` adapter receives `{ children, ...props }` and is responsible for
 * mounting `<DialogHeading {...props}>{children}</DialogHeading>` in its own idiom.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const { children = 'Title', ...props } = propsOverride;
    const wrapper = render({ children, ...props }, options);
    const dialogHeading = getByClassName(document.body, CLASSNAME);
    return { props, dialogHeading, wrapper };
};

/**
 * Shared assertions for the standalone rendering of `DialogHeading` (no enclosing container).
 * Registry wiring lives in `labelRegistryTests`; framework-specific prop/ref forwarding stays in the
 * per-package `commonTestsSuite`.
 */
export const DialogHeadingTests = (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('DialogHeading core tests', () => {
        describe('Render', () => {
            it('should render as a heading', () => {
                setup({ children: 'Title' }, renderOptions);
                expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
            });

            it('should generate an id when none is provided', () => {
                const { dialogHeading } = setup({}, renderOptions);
                expect(dialogHeading.id).toBeTruthy();
            });

            it('should use the consumer-supplied id as-is', () => {
                const { dialogHeading } = setup({ id: 'my-custom-id' }, renderOptions);
                expect(dialogHeading.id).toBe('my-custom-id');
            });
        });
    });
};
