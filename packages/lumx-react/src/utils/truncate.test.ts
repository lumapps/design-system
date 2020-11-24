import { EllipsisType, truncate } from './truncate';

const text =
    'act above death fully now pick warm knew front certainly fear fellow through farther month whispered wood weather widely field double suddenly journey put';

describe(`truncate util`, () => {
    it('should not truncate the text since it need exceed the max', () => {
        const truncatedText = truncate(text, { max: 1000 });

        expect(truncatedText).toEqual(text);
    });

    it('should not truncate the text since the max is not valid', () => {
        const truncatedText = truncate(text, { max: -1 });

        expect(truncatedText).toEqual(text);
    });

    it('should truncate at the end', () => {
        const truncatedText = truncate(text, { max: 10 });

        expect(truncatedText).toEqual('act above ...');
    });

    it('should truncate at the start', () => {
        const truncatedText = truncate(text, { max: 10, ellipsisType: EllipsisType.START });

        expect(truncatedText).toEqual('...ourney put');
    });

    it('should crop at the middle', () => {
        const truncatedText = truncate(text, { max: 10, ellipsisType: EllipsisType.MIDDLE });

        expect(truncatedText).toEqual('act a...y put');
    });

    it('should crop using the custom separator', () => {
        const truncatedText = truncate(text, { max: 10, ellipsisType: EllipsisType.END, separator: '->' });

        expect(truncatedText).toEqual('act above ->');
    });
});
