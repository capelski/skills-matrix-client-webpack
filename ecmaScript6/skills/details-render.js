(function(paginatedListService, elements) {

    function render(state) {
        render.readOnly(state);
        render.skillName(state);
        render.skillEmployees(state);
        render.foundEmployees(state);
        render.viewLoader(state);
    }

    render.foundEmployees = function (state) {
        paginatedListService.render(elements.addEmployeesList, state, state.addEmployeesList);
    };

    render.skillName = function(state) {
        elements.htmlNodes.pageTitle.html(state.viewDetails.skill.Name);
        elements.htmlNodes.elementName.val(state.viewDetails.skill.Name);
    };

    render.skillEmployees = function(state) {
        paginatedListService.render(elements.skillEmployeesList, state, state.skillEmployeesList);
    };

    render.readOnly = function(state) {
        elements.htmlNodes.addEmployeesList.wrapper.hide();
        elements.htmlNodes.editButton.hide();
        elements.htmlNodes.editButton.attr('href', '#');
        elements.htmlNodes.deleteButton.hide();
        elements.htmlNodes.pageTitle.text('Skill not found');            
        elements.htmlNodes.saveButton.hide();
        elements.htmlNodes.cancelButton.hide();
        elements.htmlNodes.cancelButton.attr('href', '#');

        if (state.viewDetails.readOnly) {
            elements.htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.viewDetails.skill.Id > 0) {
                elements.htmlNodes.pageTitle.text(state.viewDetails.skill.Name);
                elements.htmlNodes.editButton.attr('href', '/skills/edit?id=' + state.viewDetails.skill.Id);
                elements.htmlNodes.editButton.show();
                elements.htmlNodes.deleteButton.show();
            }
        }
        else {
            elements.htmlNodes.elementName.removeAttr('disabled');                
            if (state.viewDetails.skill.Id >= 0) {
                elements.htmlNodes.pageTitle.text('New skill');
                elements.htmlNodes.addEmployeesList.wrapper.show();
                elements.htmlNodes.saveButton.show();
                elements.htmlNodes.cancelButton.show();
                elements.htmlNodes.cancelButton.attr('href', '/skills/');

                if (state.viewDetails.skill.Id > 0) {
                    elements.htmlNodes.pageTitle.text(state.viewDetails.skill.Name);
                    elements.htmlNodes.cancelButton.attr('href', '/skills/details?id=' +
                    state.viewDetails.skill.Id);
                }
            }
        }
    };

    render.viewLoader = function(state) {
        elements.htmlNodes.loader.parent()
        .removeClass(state.viewDetails.loadPhases.join(' ')).addClass(state.viewDetails.loadPhase);
    };

    window.skillDetails = window.skillDetails || {};
    window.skillDetails.render = render;
    
})(window.PaginatedListService, window.skillDetails.elements);
