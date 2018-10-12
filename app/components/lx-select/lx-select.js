(function IIFE() {
    'use strict';

    /////////////////////////////

    lxSelectController.$inject = ['$interpolate', '$sce'];

    function lxSelectController($interpolate, $sce) {
        var lxSelect = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The choice template.
         *
         * @type {string}
         */
        var _choiceTemplate;

        /**
         * The model controller.
         *
         * @type {Object}
         */
        var _modelController;

        /**
         * The selected template.
         *
         * @type {string}
         */
        var _selectedTemplate;

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

        /**
         * The model view value.
         *
         * @type {string}
         */
        lxSelect.viewValue = undefined;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Display the choice according to the choice template.
         *
         * @param  {Object} choice The choice object.
         * @return {string} The choice label.
         */
        function displayChoice(choice) {
            var choiceScope = {
                $choice: choice
            };

            var interpolatedChoice = $interpolate(_choiceTemplate)(choiceScope);
            return $sce.trustAsHtml(interpolatedChoice);
        }

        /**
         * Display the selected item according to the selected template.
         *
         * @param  {Object} [selected] The selected object.
         * @return {string} The selected label.
         */
        function displaySelected(selected) {
            var selectedScope = {
                $selected: angular.isDefined(selected) ? selected : _modelController.$viewValue
            };

            var interpolatedSelected = $interpolate(_selectedTemplate)(selectedScope);
            return $sce.trustAsHtml(interpolatedSelected);
        }

        /**
         * Check if the model is empty
         *
         * @return {boolean} Wether the model is empty or not.
         */
        function isModelEmpty() {
            if (lxSelect.multiple) {
                return _modelController.$viewValue.length === 0
            } else {
                return angular.isUndefined(_modelController.$viewValue);
            }
        }

        /**
         * Check if a choice is selected.
         *
         * @param  {Object}  choice The choice object.
         * @return {boolean} Wether the choice is selected or not.
         */
        function isSelected(choice) {
            var isSelected = false;

            if (lxSelect.multiple) {
                isSelected = _modelController.$viewValue.includes(choice);
            } else {
                isSelected = choice === _modelController.$viewValue;
            }

            return isSelected;
        }

        /**
         * Register the choice template.
         *
         * @param {string} choiceTemplate The choice template.
         */
        function registerChoiceTemplate(choiceTemplate) {
            _choiceTemplate = choiceTemplate;
        }

        /**
         * Select the selected template.
         *
         * @param {string} choiceTemplate The choice template.
         */
        function registerSelectedTemplate(selectedTemplate) {
            _selectedTemplate = selectedTemplate;
        }

        /**
         * Select a choice.
         *
         * @param {Object} choice The choice object.
         * @param {Event}  [ev]   The event that triggered the function.
         */
        function select(choice, ev) {
            if (lxSelect.multiple ) {
                ev.stopPropagation();
            }

            var updatedModel;

            if (lxSelect.multiple) {
                updatedModel = _modelController.$viewValue;

                if (_modelController.$viewValue.includes(choice)) {
                    updatedModel.splice(updatedModel.indexOf(choice), 1);
                } else {
                    updatedModel.push(choice);
                }
            } else {
                updatedModel = choice;
            }

            _modelController.$setViewValue(updatedModel);
        }

        /**
         * Set the model controller.
         *
         * @param {Object} modelController The model controller.
         */
        function setModelController(modelController) {
            _modelController = modelController;

            _modelController.$render = function onModelRender() {
                lxSelect.viewValue = _modelController.$viewValue;
            };
        }

        /////////////////////////////

        lxSelect.displayChoice = displayChoice;
        lxSelect.displaySelected = displaySelected;
        lxSelect.isModelEmpty = isModelEmpty;
        lxSelect.registerChoiceTemplate = registerChoiceTemplate;
        lxSelect.registerSelectedTemplate = registerSelectedTemplate;
        lxSelect.select = select;
        lxSelect.isSelected = isSelected;
        lxSelect.setModelController = setModelController;
    }

    /////////////////////////////

    function lxSelectDirective() {
        function link(scope, el, attrs, ctrls, transclude) {
            ctrls[0].setModelController(ctrls[1]);

            transclude(scope, function(clone) {
                var template = '';

                for (var i = 0; i < clone.length; i++) {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerChoiceTemplate(template);
            }, null, 'choices');

            transclude(scope, function(clone) {
                var template = '';

                for (var i = 0; i < clone.length; i++) {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerSelectedTemplate(template);
            }, null, 'selected');
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
                multiple: '=?lxMultiple'
            },
            templateUrl: 'components/lx-select/select.html',
            transclude: {
                choices: 'lxSelectChoices',
                selected: 'lxSelectSelected',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.select').directive('lxSelect', lxSelectDirective);
})();
