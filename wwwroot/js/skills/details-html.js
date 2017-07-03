(function() {
    var paginatedList = window.application.paginatedList;
    var htmlNodes = {
        addEmployeesList: paginatedList.getHtmlNodes('add-employees'),
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        employeesList : $('#employees-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.foundEmployees = function (state) {
        paginatedList.fill(htmlNodes.addEmployeesList, state.foundEmployees, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><span class="add-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-plus text-success"></i> '
                + employee.Name + '</span></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    update.readOnly = function (state) {
        htmlNodes.addEmployeesList.keywords.hide();
        htmlNodes.addEmployeesList.list.hide();
        htmlNodes.editButton.hide();
        htmlNodes.editButton.attr('href', '#');
        htmlNodes.deleteButton.hide();
        htmlNodes.pageTitle.text('Skill not found');            
        htmlNodes.saveButton.hide();
        htmlNodes.cancelButton.hide();
        htmlNodes.cancelButton.attr('href', '#');

        if (state.readOnly) {
            htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.skill.Id > 0) {
                htmlNodes.pageTitle.text(state.skill.Name);
                htmlNodes.editButton.attr('href', '/skills/edit?id=' + state.skill.Id);
                htmlNodes.editButton.show();
                htmlNodes.deleteButton.show();
            }
        }
        else {
            htmlNodes.elementName.removeAttr('disabled');                
            if (state.skill.Id >= 0) {
                htmlNodes.pageTitle.text('New skill');
                htmlNodes.addEmployeesList.keywords.show();
                htmlNodes.addEmployeesList.list.show();
                htmlNodes.saveButton.show();
                htmlNodes.cancelButton.show();
                htmlNodes.cancelButton.attr('href', '/skills/');

                if (state.skill.Id > 0) {
                    htmlNodes.pageTitle.text(state.skill.Name);
                    htmlNodes.cancelButton.attr('href', '/skills/details?id=' + state.skill.Id);
                }
            }
        }

        update.skillEmployees(state);
    };

    update.searchKeywords = function (state) {
        htmlNodes.addEmployeesList.keywords.val(state.searchKeywords);
    };

    update.skillName = function (state) {
        htmlNodes.elementName.val(state.skill.Name);
    };

    update.skillEmployees = function (state) {
        htmlNodes.employeesList.empty();
        if (state.skill.Employees.length === 0) {
            htmlNodes.employeesList.append('<i>No employees assigned yet</i>');
        }
        for (var key in state.skill.Employees) {
            var employee = state.skill.Employees[key];
            var html = '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
            if (!state.readOnly) {
                html = '<li class="list-group-item"><span class="remove-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-times text-danger"></i> '
                + employee.Name + '</span></li>';
            }
            htmlNodes.employeesList.append(html);
        }
    };

    window.application = window.application || {};
    window.application.skill = window.application.skill || {};
    window.application.skill.htmlNodes = htmlNodes;
    window.application.skill.update = update;
})();
