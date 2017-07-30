'use strict';

(function (paginatedListService, elements) {

    function render(state) {
        render.readOnly(state);
        render.employeeName(state);
        render.employeeSkills(state);
        render.foundSkills(state);
        render.viewLoader(state);
    }

    render.foundSkills = function (state) {
        paginatedListService.render(elements.addSkillsList, state, state.addSkillsList);
    };

    render.employeeName = function (state) {
        elements.htmlNodes.pageTitle.html(state.viewDetails.employee.Name);
        elements.htmlNodes.elementName.val(state.viewDetails.employee.Name);
    };

    render.employeeSkills = function (state) {
        paginatedListService.render(elements.employeeSkillsList, state, state.employeeSkillsList);
    };

    render.readOnly = function (state) {
        elements.htmlNodes.addSkillsList.wrapper.hide();
        elements.htmlNodes.editButton.hide();
        elements.htmlNodes.editButton.attr('href', '#');
        elements.htmlNodes.deleteButton.hide();
        elements.htmlNodes.pageTitle.text('Employee not found');
        elements.htmlNodes.saveButton.hide();
        elements.htmlNodes.cancelButton.hide();
        elements.htmlNodes.cancelButton.attr('href', '#');

        if (state.viewDetails.readOnly) {
            elements.htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.viewDetails.employee.Id > 0) {
                elements.htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                elements.htmlNodes.editButton.attr('href', '/employees/edit?id=' + state.viewDetails.employee.Id);
                elements.htmlNodes.editButton.show();
                elements.htmlNodes.deleteButton.show();
            }
        } else {
            elements.htmlNodes.elementName.removeAttr('disabled');
            if (state.viewDetails.employee.Id >= 0) {
                elements.htmlNodes.pageTitle.text('New employee');
                elements.htmlNodes.addSkillsList.wrapper.show();
                elements.htmlNodes.saveButton.show();
                elements.htmlNodes.cancelButton.show();
                elements.htmlNodes.cancelButton.attr('href', '/employees/');

                if (state.viewDetails.employee.Id > 0) {
                    elements.htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                    elements.htmlNodes.cancelButton.attr('href', '/employees/details?id=' + state.viewDetails.employee.Id);
                }
            }
        }
    };

    render.viewLoader = function (state) {
        elements.htmlNodes.loader.parent().removeClass(state.viewDetails.loadPhases.join(' ')).addClass(state.viewDetails.loadPhase);
    };

    window.employeeDetails = window.employeeDetails || {};
    window.employeeDetails.render = render;
})(window.PaginatedListService, window.employeeDetails.elements);