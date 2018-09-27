(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxSelectController() {
        var lxSelect = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The model controller.
         *
         * @type {Object}
         */
        var _modelController;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * The model label.
         *
         * @type {string}
         */
        lxSelect.modelLabel = undefined;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Return the choice label.
         *
         * @param  {Object} choice The choice object.
         * @return {string} The choice label.
         */
        function getChoiceLabel(choice) {
            var choiceLabel;

            if (angular.isObject(choice)) {
                choiceLabel = choice.label;
            } else {
                choiceLabel = choice;
            }

            return choiceLabel;
        }

        /**
         * Return the choice value.
         *
         * @param  {Object} choice The choice object.
         * @return {string} The choice value.
         */
        function getChoiceValue(choice) {
            var choiceValue;

            if (angular.isObject(choice)) {
                choiceValue = choice.value;
            } else {
                choiceValue = choice;
            }

            return choiceValue;
        }

        /**
         * Check if a choice is selected.
         *
         * @param  {Object}  choice The choice object.
         * @return {boolean} Wether the choice is selected or not.
         */
        function isSelected(choice) {
            var choiceValue = getChoiceValue(choice);

            return choiceValue === _modelController.$viewValue;
        }

        /**
         * Select a choice.
         *
         * @param {Object} choice The choice object.
         */
        function select(choice) {
            var choiceLabel = getChoiceLabel(choice);
            var choiceValue = getChoiceValue(choice);

            _modelController.$setViewValue(choiceValue);

            lxSelect.modelLabel = choiceLabel;
        }

        /**
         * Set the model controller.
         *
         * @param {Object} modelController The model controller.
         */
        function setModelController(modelController) {
            _modelController = modelController;

            _modelController.$render = function onModelRender() {
                if (angular.isDefined(_modelController.$viewValue)) {
                    angular.forEach(lxSelect.choices, function forEachChoice(choice) {
                        var choiceLabel = getChoiceLabel(choice);
                        var choiceValue = getChoiceValue(choice);

                        if (choiceValue === _modelController.$viewValue) {
                            lxSelect.modelLabel = choiceLabel;
                        }
                    });
                }
            };
        }

        /////////////////////////////

        lxSelect.getChoiceLabel = getChoiceLabel;
        lxSelect.getChoiceValue = getChoiceValue;
        lxSelect.select = select;
        lxSelect.isSelected = isSelected;
        lxSelect.setModelController = setModelController;
    }

    /////////////////////////////

    function lxSelectDirective() {
        function link(scope, el, attrs, ctrls) {
            ctrls[0].setModelController(ctrls[1]);
        }

        return {
            bindToController: true,
            controller: lxSelectController,
            controllerAs: 'lxSelect',
            link: link,
            replace: true,
            require: ['lxSelect', 'ngModel'],
            restrict: 'E',
            scope: {
                choices: '=lxChoices',
                label: '@?lxLabel',
            },
            templateUrl: 'components/lx-select/select.html',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.select').directive('lxSelect', lxSelectDirective);
})();
