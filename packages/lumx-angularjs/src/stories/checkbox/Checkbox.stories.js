import { DemoController } from './controller';
import DefaultTemplate from './default.html';

export default {
    title: 'LumX AngularJS/Checkbox',
};

const vm = new DemoController();

export const Default = ({ theme }) => ({ template: DefaultTemplate, props: { theme, vm } });
