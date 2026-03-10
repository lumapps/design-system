import { fireEvent, render, screen } from '@testing-library/vue';

import BaseUploaderTests, { setup } from '@lumx/core/js/components/Uploader/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Uploader';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Uploader } from '.';

describe('<Uploader />', () => {
    const renderUploader = (props: any, options?: SetupRenderOptions<any>) => render(Uploader, { ...options, props });

    BaseUploaderTests({ render: renderUploader, screen });

    const setupUploader = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderUploader, screen });

    describe('Vue', () => {
        it('should emit change event with files when file input changes', async () => {
            const { emitted } = render(Uploader, {
                props: { fileInputProps: {} },
            });
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });

            Object.defineProperty(input, 'files', { value: [file], configurable: true });
            await fireEvent.change(input);

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)[0][0]).toEqual([file]);
        });

        it('should not emit change when disabled', async () => {
            const { emitted } = render(Uploader, {
                props: { fileInputProps: {}, isDisabled: true },
            });
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });

            Object.defineProperty(input, 'files', { value: [file], configurable: true });
            await fireEvent.change(input);

            expect(emitted('change')).toBeUndefined();
        });

        it('should apply drag hovering class on drag enter and remove on drag leave', async () => {
            render(Uploader, { props: { fileInputProps: {} } });
            const uploader = document.querySelector(`.${CLASSNAME}`) as HTMLElement;
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;

            expect(uploader).not.toHaveClass(`${CLASSNAME}--is-drag-hovering`);

            await fireEvent.dragEnter(input);
            expect(uploader).toHaveClass(`${CLASSNAME}--is-drag-hovering`);

            await fireEvent.dragLeave(input);
            expect(uploader).not.toHaveClass(`${CLASSNAME}--is-drag-hovering`);
        });
    });

    commonTestsSuiteVTL(setupUploader, {
        baseClassName: CLASSNAME,
        forwardClassName: 'uploader',
        forwardAttributes: 'uploader',
        applyTheme: {
            affects: [{ element: 'uploader' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
