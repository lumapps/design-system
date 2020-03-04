function DemoController() {
    'ngInject';

    const vm = this;

    /**
     * The list of tags.
     *
     * @type {Array}
     */
    vm.tags = ['Tag 1', 'Tag 2'];
}

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
